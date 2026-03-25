"""
Client Management Tools for Tax Document Assistant
Data is embedded directly since WXO tools cannot access local files.
"""
from ibm_watsonx_orchestrate.agent_builder.tools import tool
from typing import Dict, List, Optional, Any

# Embedded client data - WXO tools run in isolated cloud and cannot access local files
CLIENT_DATA = [
    {
        "client_id": "CLI001",
        "name": "Sarah Johnson",
        "email": "sarah.johnson@email.com",
        "phone": "555-0101",
        "client_type": "Individual",
        "filing_status": "In Progress",
        "tax_year": "2025",
        "documents_required": 8,
        "documents_submitted": 6,
        "completion_percentage": 75,
        "last_update_date": "2026-03-05",
        "submission_deadline": "2026-04-15",
        "status": "active"
    },
    {
        "client_id": "CLI002",
        "name": "Michael Chen",
        "email": "michael.chen@email.com",
        "phone": "555-0102",
        "client_type": "Small Business",
        "filing_status": "Not Started",
        "tax_year": "2025",
        "documents_required": 15,
        "documents_submitted": 0,
        "completion_percentage": 0,
        "last_update_date": "2026-02-20",
        "submission_deadline": "2026-04-15",
        "status": "active"
    },
    {
        "client_id": "CLI003",
        "name": "Emily Rodriguez",
        "email": "emily.rodriguez@email.com",
        "phone": "555-0103",
        "client_type": "Individual",
        "filing_status": "Complete",
        "tax_year": "2025",
        "documents_required": 6,
        "documents_submitted": 6,
        "completion_percentage": 100,
        "last_update_date": "2026-03-10",
        "submission_deadline": "2026-04-15",
        "status": "active"
    },
    {
        "client_id": "CLI004",
        "name": "TechStart Inc",
        "email": "accounting@techstart.com",
        "phone": "555-0104",
        "client_type": "Corporate",
        "filing_status": "In Progress",
        "tax_year": "2025",
        "documents_required": 25,
        "documents_submitted": 18,
        "completion_percentage": 72,
        "last_update_date": "2026-03-08",
        "submission_deadline": "2026-06-15",
        "status": "active"
    },
    {
        "client_id": "CLI005",
        "name": "David Martinez",
        "email": "david.martinez@email.com",
        "phone": "555-0105",
        "client_type": "Small Business",
        "filing_status": "In Progress",
        "tax_year": "2025",
        "documents_required": 12,
        "documents_submitted": 10,
        "completion_percentage": 83,
        "last_update_date": "2026-03-09",
        "submission_deadline": "2026-04-15",
        "status": "active"
    },
    {
        "client_id": "CLI006",
        "name": "Jennifer Lee",
        "email": "jennifer.lee@email.com",
        "phone": "555-0106",
        "client_type": "Individual",
        "filing_status": "In Progress",
        "tax_year": "2025",
        "documents_required": 7,
        "documents_submitted": 3,
        "completion_percentage": 43,
        "last_update_date": "2026-03-01",
        "submission_deadline": "2026-04-15",
        "status": "active"
    },
    {
        "client_id": "CLI007",
        "name": "Global Solutions LLC",
        "email": "finance@globalsolutions.com",
        "phone": "555-0107",
        "client_type": "Corporate",
        "filing_status": "Not Started",
        "tax_year": "2025",
        "documents_required": 30,
        "documents_submitted": 0,
        "completion_percentage": 0,
        "last_update_date": "2026-02-15",
        "submission_deadline": "2026-06-15",
        "status": "active"
    },
    {
        "client_id": "CLI008",
        "name": "Robert Thompson",
        "email": "robert.thompson@email.com",
        "phone": "555-0108",
        "client_type": "Individual",
        "filing_status": "Complete",
        "tax_year": "2025",
        "documents_required": 5,
        "documents_submitted": 5,
        "completion_percentage": 100,
        "last_update_date": "2026-03-11",
        "submission_deadline": "2026-04-15",
        "status": "active"
    }
]

@tool
def get_client_data(
    client_id: Optional[str] = None,
    client_type: Optional[str] = None,
    filing_status: Optional[str] = None,
    status: Optional[str] = None,
    limit: Optional[int] = None
) -> List[Dict[str, Any]]:
    """
    Retrieve client data with flexible filtering options.
    
    Args:
        client_id: Filter by specific client ID
        client_type: Filter by client type (Individual, Small Business, Corporate)
        filing_status: Filter by filing status (Not Started, In Progress, Complete, Filed)
        status: Filter by account status (active, inactive)
        limit: Maximum number of results to return
    
    Returns:
        List of client dictionaries matching the filters
    """
    results = CLIENT_DATA.copy()
    
    if client_id:
        results = [c for c in results if c.get("client_id") == client_id]
    if client_type:
        results = [c for c in results if c.get("client_type") == client_type]
    if filing_status:
        results = [c for c in results if c.get("filing_status") == filing_status]
    if status:
        results = [c for c in results if c.get("status") == status]
    if limit and limit > 0:
        results = results[:limit]
    
    return results

@tool
def get_client_by_id(client_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieve a single client by their unique identifier.
    
    Args:
        client_id: The unique client identifier (e.g., CLI001)
    
    Returns:
        Client dictionary if found, error message if not found
    """
    for client in CLIENT_DATA:
        if client.get("client_id") == client_id:
            return client
    return {"error": f"Client {client_id} not found"}

@tool
def get_clients_by_type(client_type: str) -> List[Dict[str, Any]]:
    """
    Retrieve all clients of a specific type.
    
    Args:
        client_type: The client type (Individual, Small Business, or Corporate)
    
    Returns:
        List of clients matching the specified type
    """
    return [c for c in CLIENT_DATA if c.get("client_type") == client_type]

@tool
def calculate_client_metrics(
    client_type: Optional[str] = None,
    filing_status: Optional[str] = None
) -> Dict[str, Any]:
    """
    Calculate aggregated metrics for clients.
    
    Args:
        client_type: Optional filter by client type
        filing_status: Optional filter by filing status
    
    Returns:
        Dictionary containing various metrics and statistics
    """
    # Apply filters
    clients = CLIENT_DATA
    if client_type:
        clients = [c for c in clients if c.get("client_type") == client_type]
    if filing_status:
        clients = [c for c in clients if c.get("filing_status") == filing_status]
    
    if not clients:
        return {"error": "No clients match the specified filters"}
    
    # Calculate metrics
    total_count = len(clients)
    active_count = len([c for c in clients if c.get("status") == "active"])
    
    # Filing status distribution
    status_distribution = {}
    for status in ["Not Started", "In Progress", "Complete", "Filed"]:
        count = len([c for c in clients if c.get("filing_status") == status])
        status_distribution[status] = count
    
    # Client type distribution
    type_distribution = {}
    for ctype in ["Individual", "Small Business", "Corporate"]:
        count = len([c for c in clients if c.get("client_type") == ctype])
        type_distribution[ctype] = count
    
    # Completion statistics
    completion_percentages = [c.get("completion_percentage", 0) for c in clients]
    avg_completion = sum(completion_percentages) / len(completion_percentages) if completion_percentages else 0
    
    # Document statistics
    total_docs_required = sum(c.get("documents_required", 0) for c in clients)
    total_docs_submitted = sum(c.get("documents_submitted", 0) for c in clients)
    
    return {
        "total_clients": total_count,
        "active_clients": active_count,
        "filing_status_distribution": status_distribution,
        "client_type_distribution": type_distribution,
        "average_completion_percentage": round(avg_completion, 2),
        "total_documents_required": total_docs_required,
        "total_documents_submitted": total_docs_submitted,
        "overall_document_completion": round((total_docs_submitted / total_docs_required * 100) if total_docs_required > 0 else 0, 2)
    }

# Made with Bob
