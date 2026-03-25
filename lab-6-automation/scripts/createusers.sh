#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

USER_LIST="${1:-users.txt}"
LOG_FILE="grant_sudo.log"
GROUP="wheel"
DEFAULT_PASSWORD="P@ssw0rd#2026!"

SUDOERS_FILE="/etc/sudoers.d/99-wheel-nopasswd"

echo "===== Script Started: $(date) =====" | tee -a "$LOG_FILE"

if [[ "$EUID" -ne 0 ]]; then
  echo "ERROR: Run as root." | tee -a "$LOG_FILE"
  exit 1
fi

if [[ ! -f "$USER_LIST" ]]; then
  echo "ERROR: File '$USER_LIST' not found." | tee -a "$LOG_FILE"
  exit 1
fi

if ! getent group "$GROUP" >/dev/null 2>&1; then
  echo "ERROR: Group '$GROUP' does not exist." | tee -a "$LOG_FILE"
  exit 1
fi


if [[ ! -f "$SUDOERS_FILE" ]]; then
  echo "INFO: Configuring passwordless sudo for group '$GROUP'..." | tee -a "$LOG_FILE"

  echo "%$GROUP ALL=(ALL) NOPASSWD: ALL" > "$SUDOERS_FILE"
  chmod 440 "$SUDOERS_FILE"

  if visudo -cf "$SUDOERS_FILE"; then
    echo "SUCCESS: Passwordless sudo configured." | tee -a "$LOG_FILE"
  else
    echo "ERROR: Invalid sudoers configuration. Rolling back." | tee -a "$LOG_FILE"
    rm -f "$SUDOERS_FILE"
    exit 1
  fi
else
  echo "INFO: Passwordless sudo already configured." | tee -a "$LOG_FILE"
fi

total=0
created=0
added=0
skipped=0
failed=0
password_set=0

while IFS= read -r user || [[ -n "$user" ]]; do
  ((total++)) || true

  user="$(echo "$user" | xargs 2>/dev/null || true)"

  if [[ -z "$user" || "$user" =~ ^# ]]; then
    ((skipped++)) || true
    continue
  fi

  if [[ ! "$user" =~ ^[a-z_][a-z0-9_-]*[$]?$ ]]; then
    echo "WARNING: Invalid username '$user'. Skipping." | tee -a "$LOG_FILE"
    ((skipped++)) || true
    continue
  fi

  if ! id "$user" >/dev/null 2>&1; then
    echo "INFO: Creating user '$user'..." | tee -a "$LOG_FILE"

    if useradd -m -s /bin/bash "$user"; then
      echo "SUCCESS: User '$user' created." | tee -a "$LOG_FILE"
      ((created++)) || true
    else
      echo "ERROR: Failed to create '$user'." | tee -a "$LOG_FILE"
      ((failed++)) || true
      continue
    fi
  else
    echo "INFO: User '$user' already exists." | tee -a "$LOG_FILE"
  fi

  if id -nG "$user" | grep -qw "$GROUP"; then
    echo "INFO: '$user' already has sudo access." | tee -a "$LOG_FILE"
  else
    if usermod -aG "$GROUP" "$user"; then
      echo "SUCCESS: Granted sudo access to '$user'." | tee -a "$LOG_FILE"
      ((added++)) || true
    else
      echo "ERROR: Failed to add '$user' to '$GROUP'." | tee -a "$LOG_FILE"
      ((failed++)) || true
      continue
    fi
  fi

  passwd_status="$(passwd -S "$user" 2>/dev/null | awk '{print $2}' || echo "NP")"

  if [[ "$passwd_status" == "P" ]]; then
    echo "INFO: Password already set for '$user'." | tee -a "$LOG_FILE"
  else
    echo "INFO: Setting password for '$user'." | tee -a "$LOG_FILE"

    if echo "$user:$DEFAULT_PASSWORD" | chpasswd; then
      echo "SUCCESS: Password set for '$user'." | tee -a "$LOG_FILE"
      ((password_set++)) || true
      chage -d 0 "$user" || true
    else
      echo "ERROR: Failed to set password for '$user'." | tee -a "$LOG_FILE"
      ((failed++)) || true
    fi
  fi

done < "$USER_LIST"

echo "===== Summary =====" | tee -a "$LOG_FILE"
echo "Total processed : $total" | tee -a "$LOG_FILE"
echo "Users created   : $created" | tee -a "$LOG_FILE"
echo "Sudo granted    : $added" | tee -a "$LOG_FILE"
echo "Passwords set   : $password_set" | tee -a "$LOG_FILE"
echo "Skipped         : $skipped" | tee -a "$LOG_FILE"
echo "Failed          : $failed" | tee -a "$LOG_FILE"

echo "===== Completed: $(date) =====" | tee -a "$LOG_FILE"