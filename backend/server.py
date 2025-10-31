from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class Module(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    content: str
    category: str  # basics, upi, security, wallets
    duration: int  # in minutes
    icon: str
    order: int

class ModuleCreate(BaseModel):
    title: str
    description: str
    content: str
    category: str
    duration: int
    icon: str
    order: int

class UserProgress(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    module_id: str
    completed: bool = False
    completed_at: Optional[str] = None

class UserProgressCreate(BaseModel):
    session_id: str
    module_id: str
    completed: bool = False

class DemoTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    payment_method: str  # upi, wallet, card
    amount: float
    recipient: str
    status: str  # success, pending, failed
    timestamp: str

class DemoTransactionCreate(BaseModel):
    session_id: str
    payment_method: str
    amount: float
    recipient: str

class AnalyticsData(BaseModel):
    total_users: int
    transactions_completed: int
    modules_completed: int
    adoption_rate: float
    monthly_growth: List[dict]
    payment_method_distribution: dict


# Routes
@api_router.get("/")
async def root():
    return {"message": "Digital Payment Awareness Platform API"}

# Module routes
@api_router.get("/modules", response_model=List[Module])
async def get_modules():
    modules = await db.modules.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return modules

@api_router.get("/modules/{module_id}", response_model=Module)
async def get_module(module_id: str):
    module = await db.modules.find_one({"id": module_id}, {"_id": 0})
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return module

@api_router.post("/modules", response_model=Module)
async def create_module(input: ModuleCreate):
    module_dict = input.model_dump()
    module_obj = Module(**module_dict)
    doc = module_obj.model_dump()
    await db.modules.insert_one(doc)
    return module_obj

# User Progress routes
@api_router.post("/progress", response_model=UserProgress)
async def update_progress(input: UserProgressCreate):
    # Check if progress already exists
    existing = await db.user_progress.find_one({
        "session_id": input.session_id,
        "module_id": input.module_id
    }, {"_id": 0})
    
    if existing:
        # Update existing
        await db.user_progress.update_one(
            {"session_id": input.session_id, "module_id": input.module_id},
            {"$set": {
                "completed": input.completed,
                "completed_at": datetime.now(timezone.utc).isoformat() if input.completed else None
            }}
        )
        updated = await db.user_progress.find_one({
            "session_id": input.session_id,
            "module_id": input.module_id
        }, {"_id": 0})
        return updated
    else:
        # Create new
        progress_dict = input.model_dump()
        progress_obj = UserProgress(**progress_dict)
        if progress_obj.completed:
            progress_obj.completed_at = datetime.now(timezone.utc).isoformat()
        doc = progress_obj.model_dump()
        await db.user_progress.insert_one(doc)
        return progress_obj

@api_router.get("/progress/{session_id}", response_model=List[UserProgress])
async def get_user_progress(session_id: str):
    progress = await db.user_progress.find({"session_id": session_id}, {"_id": 0}).to_list(100)
    return progress

# Demo Transaction routes
@api_router.post("/demo-transaction", response_model=DemoTransaction)
async def create_demo_transaction(input: DemoTransactionCreate):
    transaction_dict = input.model_dump()
    # Add required fields for DemoTransaction
    transaction_dict["status"] = "success"  # Demo always succeeds
    transaction_dict["timestamp"] = datetime.now(timezone.utc).isoformat()
    transaction_obj = DemoTransaction(**transaction_dict)
    doc = transaction_obj.model_dump()
    await db.demo_transactions.insert_one(doc)
    return transaction_obj

@api_router.get("/demo-transactions/{session_id}", response_model=List[DemoTransaction])
async def get_demo_transactions(session_id: str):
    transactions = await db.demo_transactions.find(
        {"session_id": session_id}, 
        {"_id": 0}
    ).sort("timestamp", -1).to_list(100)
    return transactions

# Analytics routes
@api_router.get("/analytics", response_model=AnalyticsData)
async def get_analytics():
    # Get actual counts from database
    total_transactions = await db.demo_transactions.count_documents({})
    total_progress = await db.user_progress.count_documents({"completed": True})
    unique_users = len(await db.user_progress.distinct("session_id"))
    
    # Simulated data with some real counts
    return {
        "total_users": max(unique_users, 12500),
        "transactions_completed": max(total_transactions, 8750),
        "modules_completed": max(total_progress, 15200),
        "adoption_rate": 68.5,
        "monthly_growth": [
            {"month": "Jan", "users": 2100, "transactions": 1450},
            {"month": "Feb", "users": 2800, "transactions": 2100},
            {"month": "Mar", "users": 3500, "transactions": 2850},
            {"month": "Apr", "users": 4200, "transactions": 3600},
            {"month": "May", "users": 5100, "transactions": 4500},
            {"month": "Jun", "users": 6200, "transactions": 5400}
        ],
        "payment_method_distribution": {
            "UPI": 58,
            "Mobile Wallet": 28,
            "Cards": 14
        }
    }

# Initialize default modules
@api_router.post("/init-data")
async def initialize_data():
    # Check if data already exists
    count = await db.modules.count_documents({})
    if count > 0:
        return {"message": "Data already initialized"}
    
    default_modules = [
        {
            "id": str(uuid.uuid4()),
            "title": "What is Digital Payment?",
            "description": "Learn the basics of digital payments and why they matter",
            "content": "Digital payments are electronic transactions that don't require physical cash. They're safe, fast, and convenient. In this module, you'll learn how digital payments work, their benefits, and why they're important for economic growth.",
            "category": "basics",
            "duration": 5,
            "icon": "Smartphone",
            "order": 1
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Understanding UPI",
            "description": "Master Unified Payments Interface - India's digital payment revolution",
            "content": "UPI (Unified Payments Interface) lets you send and receive money instantly using just a mobile number or UPI ID. It's free, secure, and works 24/7. Learn how to create your UPI ID, link your bank account, and make your first payment.",
            "category": "upi",
            "duration": 8,
            "icon": "Zap",
            "order": 2
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Mobile Wallets",
            "description": "Explore digital wallets and how to use them safely",
            "content": "Digital wallets store your payment information securely on your phone. Popular wallets include Paytm, PhonePe, and Google Pay. Learn how to add money, make payments, and manage your wallet balance.",
            "category": "wallets",
            "duration": 6,
            "icon": "Wallet",
            "order": 3
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Payment Security",
            "description": "Stay safe while making digital transactions",
            "content": "Security is crucial in digital payments. Learn about PIN protection, OTP verification, avoiding fraud, identifying fake payment apps, and what to do if something goes wrong. Never share your PIN, OTP, or password with anyone.",
            "category": "security",
            "duration": 7,
            "icon": "Shield",
            "order": 4
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Benefits for Business",
            "description": "How digital payments help small businesses grow",
            "content": "Digital payments help businesses track sales, reduce cash handling, reach more customers, and grow faster. Learn how to accept digital payments in your shop, manage your business account, and understand payment settlements.",
            "category": "basics",
            "duration": 6,
            "icon": "Store",
            "order": 5
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Common Problems & Solutions",
            "description": "Troubleshoot common issues in digital payments",
            "content": "Sometimes transactions fail or money gets stuck. Learn how to handle failed transactions, contact customer support, check transaction status, and get refunds. Most problems are solved within 24 hours.",
            "category": "security",
            "duration": 5,
            "icon": "HelpCircle",
            "order": 6
        }
    ]
    
    await db.modules.insert_many(default_modules)
    return {"message": "Data initialized successfully", "modules_created": len(default_modules)}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()