import sys
from io import StringIO
import traceback
import pandas as pd
import logging

# Security blacklist - can be extended via environment variable
BLACKLIST = [
    'os.', 'sys.', 'subprocess.', 'open(', 'exec(', 'eval(',
    'import os', 'import sys', 'document.', 'window.', 'XMLHttpRequest',
    'fetch(', 'eval(', 'Function(', 'script', 'javascript:'
]

logger = logging.getLogger(__name__)

def validate_pandas_code(code: str) -> dict:
    """
    Validate pandas code for basic security and syntax.
    
    Args:
        code: Python code string to validate
        
    Returns:
        dict: Validation result with 'valid' boolean and 'error' message if invalid
    """
    if not code:
        return {
            'valid': False,
            'error': 'Code cannot be empty'
        }
    
    if not isinstance(code, str):
        return {
            'valid': False,
            'error': f'Code must be a string, got {type(code).__name__}'
        }
    
    # Check code length
    if len(code) > 100000:  # 100KB limit
        return {
            'valid': False,
            'error': 'Code exceeds maximum length of 100KB'
        }
    
    # Check for basic syntax errors
    try:
        compile(code, '<string>', 'exec')
    except SyntaxError as e:
        return {
            'valid': False,
            'error': f'Syntax error in code: {str(e)}; code={code}'
        }
    
    return {'valid': True}

def get_forbidden_reason(forbidden_op: str) -> str:
    """Get the reason why an operation is forbidden.
    
    Args:
        forbidden_op: The forbidden operation string
        
    Returns:
        str: Reason why the operation is forbidden
    """
    reason_map = {
        'os.': 'Operating system access can compromise file system security',
        'sys.': 'System module access can allow unsafe system operations',
        'subprocess.': 'Subprocess execution can run arbitrary commands',
        'open(': 'Direct file access bypasses pandas security controls',
        'exec(': 'Dynamic code execution can run arbitrary code',
        'eval(': 'Dynamic evaluation can execute arbitrary expressions',
        'import os': 'Direct OS module import bypasses security controls',
        'import sys': 'Direct system module import bypasses security controls',
        'document.': 'DOM access is not relevant for pandas data analysis',
        'window.': 'Browser window access is not relevant for pandas data analysis',
        'XMLHttpRequest': 'Network requests are not relevant for pandas data analysis',
        'fetch(': 'Network requests are not relevant for pandas data analysis',
        'Function(': 'Dynamic function creation can execute arbitrary code',
        'script': 'Script tags are not relevant for pandas data analysis',
        'javascript:': 'JavaScript execution is not relevant for pandas data analysis'
    }
    
    return reason_map.get(forbidden_op, 'This operation is forbidden for security reasons')

def execute_pandas_code(code: str) -> dict:
    """Execute pandas code with smart suggestions and security checks.
    
    Requirements:
        - Must contain full import and file loading logic using the provided file_path
        - Must assign final result to 'result' variable
        - Code must use the provided file_path to load data
    
    Returns:
        dict: Either the result or error information
        
    Example:
        >>> execute_pandas_code('''
        ... import pandas as pd
        ... df = pd.read_csv(file_path)
        ... result = df.sum()
        ... ''', '/path/to/data.csv')
        {
            "result": {
                "type": "series",
                "data": {"A": 3, "B": 7},
                "dtype": "int64"
            }
        }
    """

    # Validate code first
    validation = validate_pandas_code(code)
    if not validation['valid']:
        return {"error": f"validation error={validation['error']}"}
    
    # Security checks
    for forbidden in BLACKLIST:
        if forbidden in code:
            return {"error": f"Code contains forbidden operation: {forbidden}"}

    # Prepare execution environment with memory optimizations
    local_vars = {
        'pd': pd,
        'read_csv_chunked': lambda path: pd.read_csv(path, chunksize=10000)
    }
    stdout_capture = StringIO()
    old_stdout = sys.stdout
    sys.stdout = stdout_capture

    try:
        # First check for syntax errors
        try:
            compile(code, '<string>', 'exec')
        except SyntaxError as e:
            return {
                "error": f"Code compilation failed: {str(e)}",
                "traceback": traceback.format_exc(),
                "stdout_capture": stdout_capture.getvalue()
            }
        except Exception as e:
            return {
                "error": f"Code compilation failed: {str(e)}",
                "traceback": traceback.format_exc(),
                "stdout_capture": stdout_capture.getvalue()
            }

        # Execute with memory monitoring
        try:
            exec(code, {}, local_vars)
        except Exception as e:
            return {
                "error": f"Code execution failed: {str(e)}",
                "traceback": traceback.format_exc(),
                "stdout_capture": stdout_capture.getvalue()
            }
        
        # Clear intermediate variables
        for var in list(local_vars.keys()):
            if var not in ('result', 'pd'):
                del local_vars[var]
                
        result = local_vars.get('result', None)
        logger.debug(f"Result type: {type(result)}")
        logger.debug(f"Result value: {result}")

        if result is None:
            return {
                "error": "No 'result' variable found in code",
                "stdout_capture": stdout_capture.getvalue()
            }

        # Handle memory optimization for large DataFrames/Series
        if isinstance(result, (pd.DataFrame, pd.Series)):
            if hasattr(result, 'memory_usage'):
                mem_usage = result.memory_usage(deep=True)
                # For Series, memory_usage returns a scalar; for DataFrame, it returns a Series
                if isinstance(mem_usage, pd.Series):
                    mem_usage = mem_usage.sum()
                if mem_usage > 1e8:  # >100MB
                    result = result.head(100)
        
        # Format result
        if isinstance(result, (pd.DataFrame, pd.Series)):
            result = str(result.to_dict())
        else:
            result = str(result)
        
        logger.debug(f"Final result: {result}")
        
        return {
            "result": [result] if result is not None else [],
        }

    except Exception as e:
        logger.error(f"Execution failed: {str(e)}")
        return {
            "error": str(e),
            "traceback": traceback.format_exc(),
            "stdout_capture": stdout_capture.getvalue()
        }
    finally:
        sys.stdout = old_stdout