"""
Communication Tools for Tax Document Assistant
Data is embedded directly since WXO tools cannot access local files.
Tools do NOT call other tools — they run in isolation.
"""
from ibm_watsonx_orchestrate.agent_builder.tools import tool
from typing import Dict, Optional, Any

# Embedded client data - must be self-contained, cannot import from other tools
CLIENT_DATA = [
    {
        "client_id": "CLI001",
        "name": "Sarah Johnson",
        "email": "sarah.johnson@email.com",
        "client_type": "Individual",
        "filing_status": "In Progress",
        "tax_year": "2025",
        "documents_required": 8,
        "documents_submitted": 6,
        "completion_percentage": 75,
        "submission_deadline": "2026-04-15",
        "status": "active"
    },
    {
        "client_id": "CLI002",
        "name": "Michael Chen",
        "email": "michael.chen@email.com",
        "client_type": "Small Business",
        "filing_status": "Not Started",
        "tax_year": "2025",
        "documents_required": 15,
        "documents_submitted": 0,
        "completion_percentage": 0,
        "submission_deadline": "2026-04-15",
        "status": "active"
    },
    {
        "client_id": "CLI003",
        "name": "Emily Rodriguez",
        "email": "emily.rodriguez@email.com",
        "client_type": "Individual",
        "filing_status": "Complete",
        "tax_year": "2025",
        "documents_required": 6,
        "documents_submitted": 6,
        "completion_percentage": 100,
        "submission_deadline": "2026-04-15",
        "status": "active"
    },
    {
        "client_id": "CLI004",
        "name": "TechStart Inc",
        "email": "accounting@techstart.com",
        "client_type": "Corporate",
        "filing_status": "In Progress",
        "tax_year": "2025",
        "documents_required": 25,
        "documents_submitted": 18,
        "completion_percentage": 72,
        "submission_deadline": "2026-06-15",
        "status": "active"
    },
    {
        "client_id": "CLI005",
        "name": "David Martinez",
        "email": "david.martinez@email.com",
        "client_type": "Small Business",
        "filing_status": "In Progress",
        "tax_year": "2025",
        "documents_required": 12,
        "documents_submitted": 10,
        "completion_percentage": 83,
        "submission_deadline": "2026-04-15",
        "status": "active"
    },
    {
        "client_id": "CLI006",
        "name": "Jennifer Lee",
        "email": "jennifer.lee@email.com",
        "client_type": "Individual",
        "filing_status": "In Progress",
        "tax_year": "2025",
        "documents_required": 7,
        "documents_submitted": 3,
        "completion_percentage": 43,
        "submission_deadline": "2026-04-15",
        "status": "active"
    },
    {
        "client_id": "CLI007",
        "name": "Global Solutions LLC",
        "email": "finance@globalsolutions.com",
        "client_type": "Corporate",
        "filing_status": "Not Started",
        "tax_year": "2025",
        "documents_required": 30,
        "documents_submitted": 0,
        "completion_percentage": 0,
        "submission_deadline": "2026-06-15",
        "status": "active"
    },
    {
        "client_id": "CLI008",
        "name": "Robert Thompson",
        "email": "robert.thompson@email.com",
        "client_type": "Individual",
        "filing_status": "Complete",
        "tax_year": "2025",
        "documents_required": 5,
        "documents_submitted": 5,
        "completion_percentage": 100,
        "submission_deadline": "2026-04-15",
        "status": "active"
    }
]

@tool
def generate_communication(
    client_id: str,
    message_type: str,
    client_name: Optional[str] = None,
    client_type: Optional[str] = None,
    custom_content: Optional[str] = None
) -> Dict[str, Any]:
    """
    Generate personalized communications for clients.
    
    Args:
        client_id: The unique client identifier
        message_type: Type of message - 'status_update', 'missing_reminder', 'deadline_alert', 'completion_report'
        client_name: Optional override for client name
        client_type: Optional override for client type
        custom_content: Optional additional custom content to include
    
    Returns:
        Dictionary with subject, body (HTML), format, client_id, and message_type
    """
    # Find client in embedded data
    client = None
    for c in CLIENT_DATA:
        if c.get('client_id') == client_id:
            client = c
            break
    
    if not client:
        return {
            "error": f"Client {client_id} not found",
            "subject": "Error",
            "body": f"<p>Could not find client with ID {client_id}</p>",
            "format": "html"
        }
    
    # Use provided values or defaults from client data
    actual_name = client_name or client.get('name', 'Valued Client')
    actual_type = client_type or client.get('client_type', 'Individual')
    
    # Get appropriate template
    template = _get_message_template(message_type, actual_type)
    
    # Personalize content
    personalized = _personalize_content(template, client, actual_name, actual_type, custom_content)
    
    return {
        "subject": personalized["subject"],
        "body": personalized["body"],
        "format": "html",
        "client_id": client_id,
        "message_type": message_type
    }

def _get_message_template(message_type: str, client_type: Optional[str] = None) -> Dict[str, str]:
    """Get message template based on type and client type."""
    
    # Client type colors for branding
    type_colors = {
        "Individual": "#3498db",
        "Small Business": "#9b59b6",
        "Corporate": "#2c3e50"
    }
    type_color = type_colors.get(client_type, "#3498db")
    
    templates = {
        "status_update": {
            "subject": "Tax Document Status Update - {{tax_year}}",
            "body": f"""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: {type_color}; color: white; padding: 20px; text-align: center;">
                <h1>Tax Document Assistant</h1>
                <p style="margin: 0;">Your Partner in Tax Document Organization</p>
              </div>
              <div style="padding: 30px; background: #f9f9f9;">
                <p>Dear {{{{name}}}},</p>
                <p>Here's your current tax document submission status for {{{{tax_year}}}}:</p>
                <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: {type_color};">Document Progress</h3>
                  <div style="background: #e0e0e0; height: 30px; border-radius: 15px; overflow: hidden;">
                    <div style="background: {type_color}; height: 100%; width: {{{{completion_percentage}}}}%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                      {{{{completion_percentage}}}}%
                    </div>
                  </div>
                  <p style="margin: 10px 0 0 0;">
                    <strong>{{{{documents_submitted}}}}</strong> of <strong>{{{{documents_required}}}}</strong> documents submitted
                  </p>
                  <p style="margin: 5px 0 0 0; color: #666;">
                    Filing Status: <strong>{{{{filing_status}}}}</strong>
                  </p>
                  <p style="margin: 5px 0 0 0; color: #666;">
                    Deadline: <strong>{{{{submission_deadline}}}}</strong>
                  </p>
                </div>
                {{{{custom_content}}}}
                <p>Keep up the great work! If you have any questions, we're here to help.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="#" style="background: {type_color}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">View Full Status</a>
                </div>
                <p>Best regards,<br>Tax Document Assistant Team</p>
              </div>
              <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                <p>This is an automated status update. Client Type: {{{{client_type}}}}</p>
              </div>
            </div>
            </body>
            </html>"""
        },
        "missing_reminder": {
            "subject": "Reminder: Missing Tax Documents - {{tax_year}}",
            "body": f"""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: {type_color}; color: white; padding: 20px; text-align: center;">
                <h1>Tax Document Assistant</h1>
                <p style="margin: 0;">Document Submission Reminder</p>
              </div>
              <div style="padding: 30px; background: #f9f9f9;">
                <p>Dear {{{{name}}}},</p>
                <p>We noticed you still have some documents pending for your {{{{tax_year}}}} tax filing:</p>
                <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #856404;">Missing Documents</h3>
                  <p style="margin: 5px 0;">You have <strong>{{{{documents_missing}}}}</strong> documents remaining to submit.</p>
                  <p style="margin: 5px 0;">Current completion: <strong>{{{{completion_percentage}}}}%</strong></p>
                  <p style="margin: 5px 0;">Deadline: <strong>{{{{submission_deadline}}}}</strong></p>
                </div>
                {{{{custom_content}}}}
                <p>Don't worry - we're here to help! Submit your remaining documents at your earliest convenience to stay on track.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="#" style="background: {type_color}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Upload Documents</a>
                </div>
                <p>Best regards,<br>Tax Document Assistant Team</p>
              </div>
              <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                <p>Need help? Contact us anytime. Client Type: {{{{client_type}}}}</p>
              </div>
            </div>
            </body>
            </html>"""
        },
        "deadline_alert": {
            "subject": "URGENT: Tax Filing Deadline Approaching - {{tax_year}}",
            "body": f"""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #dc3545; color: white; padding: 20px; text-align: center;">
                <h1>⚠️ DEADLINE ALERT</h1>
                <p style="margin: 0;">Tax Document Assistant</p>
              </div>
              <div style="padding: 30px; background: #f9f9f9;">
                <p>Dear {{{{name}}}},</p>
                <p><strong>This is an urgent reminder about your upcoming tax filing deadline.</strong></p>
                <div style="background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #721c24;">Deadline Information</h3>
                  <p style="margin: 5px 0; font-size: 18px;"><strong>Deadline: {{{{submission_deadline}}}}</strong></p>
                  <p style="margin: 5px 0;">Current completion: <strong>{{{{completion_percentage}}}}%</strong></p>
                  <p style="margin: 5px 0;">Documents remaining: <strong>{{{{documents_missing}}}}</strong></p>
                </div>
                {{{{custom_content}}}}
                <p><strong>Action Required:</strong> Please submit your remaining documents as soon as possible to avoid penalties and ensure timely filing.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="#" style="background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Submit Documents Now</a>
                </div>
                <p>If you need assistance or an extension, please contact us immediately.</p>
                <p>Best regards,<br>Tax Document Assistant Team</p>
              </div>
              <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                <p>Urgent notification. Client Type: {{{{client_type}}}}</p>
              </div>
            </div>
            </body>
            </html>"""
        },
        "completion_report": {
            "subject": "🎉 Congratulations! All Documents Submitted - {{tax_year}}",
            "body": f"""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #28a745; color: white; padding: 20px; text-align: center;">
                <h1>🎉 Congratulations!</h1>
                <p style="margin: 0;">Tax Document Assistant</p>
              </div>
              <div style="padding: 30px; background: #f9f9f9;">
                <p>Dear {{{{name}}}},</p>
                <p><strong>Excellent news! You've successfully submitted all required tax documents for {{{{tax_year}}}}.</strong></p>
                <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #155724;">✓ 100% Complete</h3>
                  <p style="margin: 5px 0;">All <strong>{{{{documents_required}}}}</strong> documents have been received and verified.</p>
                  <p style="margin: 5px 0;">Submission completed on: <strong>{{{{last_update_date}}}}</strong></p>
                  <p style="margin: 5px 0;">Well ahead of deadline: <strong>{{{{submission_deadline}}}}</strong></p>
                </div>
                {{{{custom_content}}}}
                <p><strong>What's Next?</strong></p>
                <ul>
                  <li>Your documents are being reviewed by our tax professionals</li>
                  <li>You'll receive your completed tax return within 5-7 business days</li>
                  <li>We'll notify you when your return is ready for review and filing</li>
                </ul>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="#" style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">View Summary Report</a>
                </div>
                <p>Thank you for your prompt submission and organization!</p>
                <p>Best regards,<br>Tax Document Assistant Team</p>
              </div>
              <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                <p>Completion confirmation. Client Type: {{{{client_type}}}}</p>
              </div>
            </div>
            </body>
            </html>"""
        }
    }
    
    return templates.get(message_type, templates["status_update"])

def _personalize_content(
    template: Dict[str, str],
    client: Dict[str, Any],
    name: str,
    client_type: str,
    custom_content: Optional[str] = None
) -> Dict[str, str]:
    """Personalize message template with client information."""
    
    # Calculate missing documents
    documents_missing = client.get("documents_required", 0) - client.get("documents_submitted", 0)
    
    # Replace placeholders in subject
    subject = template["subject"]
    subject = subject.replace("{{tax_year}}", str(client.get("tax_year", "2025")))
    
    # Replace placeholders in body
    body = template["body"]
    body = body.replace("{{name}}", name)
    body = body.replace("{{client_type}}", client_type)
    body = body.replace("{{tax_year}}", str(client.get("tax_year", "2025")))
    body = body.replace("{{completion_percentage}}", str(client.get("completion_percentage", 0)))
    body = body.replace("{{documents_submitted}}", str(client.get("documents_submitted", 0)))
    body = body.replace("{{documents_required}}", str(client.get("documents_required", 0)))
    body = body.replace("{{documents_missing}}", str(documents_missing))
    body = body.replace("{{filing_status}}", client.get("filing_status", "Not Started"))
    body = body.replace("{{submission_deadline}}", client.get("submission_deadline", "2026-04-15"))
    body = body.replace("{{last_update_date}}", client.get("last_update_date", "N/A"))
    
    # Add custom content if provided
    if custom_content:
        body = body.replace("{{custom_content}}", f"<p>{custom_content}</p>")
    else:
        body = body.replace("{{custom_content}}", "")
    
    return {
        "subject": subject,
        "body": body
    }

# Made with Bob
