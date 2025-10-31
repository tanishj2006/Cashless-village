import requests
import sys
import json
from datetime import datetime

class DigitalPaymentAPITester:
    def __init__(self, base_url="https://cashless-village.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.session_id = f"test_session_{datetime.now().strftime('%H%M%S')}"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f", Expected: {expected_status}"
                if response.text:
                    details += f", Response: {response.text[:200]}"
            
            self.log_test(name, success, details)
            
            if success:
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                return False, response.text

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, str(e)

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_init_data(self):
        """Test data initialization"""
        return self.run_test("Initialize Data", "POST", "init-data", 200)

    def test_get_modules(self):
        """Test getting all modules"""
        success, response = self.run_test("Get All Modules", "GET", "modules", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} modules")
            return success, response
        return success, response

    def test_get_single_module(self, module_id):
        """Test getting a single module"""
        return self.run_test(f"Get Module {module_id[:8]}...", "GET", f"modules/{module_id}", 200)

    def test_create_module(self):
        """Test creating a new module"""
        test_module = {
            "title": "Test Module",
            "description": "A test module for API testing",
            "content": "This is test content for the module.",
            "category": "test",
            "duration": 5,
            "icon": "TestIcon",
            "order": 999
        }
        return self.run_test("Create Module", "POST", "modules", 200, test_module)

    def test_update_progress(self, module_id):
        """Test updating user progress"""
        progress_data = {
            "session_id": self.session_id,
            "module_id": module_id,
            "completed": True
        }
        return self.run_test("Update Progress", "POST", "progress", 200, progress_data)

    def test_get_progress(self):
        """Test getting user progress"""
        return self.run_test("Get User Progress", "GET", f"progress/{self.session_id}", 200)

    def test_create_demo_transaction(self):
        """Test creating a demo transaction"""
        transaction_data = {
            "session_id": self.session_id,
            "payment_method": "upi",
            "amount": 100.50,
            "recipient": "test@upi"
        }
        return self.run_test("Create Demo Transaction", "POST", "demo-transaction", 200, transaction_data)

    def test_get_demo_transactions(self):
        """Test getting demo transactions"""
        return self.run_test("Get Demo Transactions", "GET", f"demo-transactions/{self.session_id}", 200)

    def test_get_analytics(self):
        """Test getting analytics data"""
        success, response = self.run_test("Get Analytics", "GET", "analytics", 200)
        if success and isinstance(response, dict):
            required_fields = ["total_users", "transactions_completed", "modules_completed", "adoption_rate"]
            missing_fields = [field for field in required_fields if field not in response]
            if missing_fields:
                print(f"   Warning: Missing fields in analytics: {missing_fields}")
            else:
                print(f"   Analytics data complete with all required fields")
        return success, response

    def run_comprehensive_test(self):
        """Run all API tests in sequence"""
        print("🚀 Starting Digital Payment Platform API Tests")
        print(f"📍 Testing against: {self.base_url}")
        print(f"🔑 Session ID: {self.session_id}")
        print("=" * 60)

        # Test 1: Root endpoint
        self.test_root_endpoint()

        # Test 2: Initialize data
        self.test_init_data()

        # Test 3: Get modules
        success, modules = self.test_get_modules()
        module_id = None
        if success and modules and len(modules) > 0:
            module_id = modules[0].get('id')

        # Test 4: Get single module (if we have one)
        if module_id:
            self.test_get_single_module(module_id)

        # Test 5: Create new module
        self.test_create_module()

        # Test 6: Update progress (if we have a module)
        if module_id:
            self.test_update_progress(module_id)

        # Test 7: Get progress
        self.test_get_progress()

        # Test 8: Create demo transaction
        self.test_create_demo_transaction()

        # Test 9: Get demo transactions
        self.test_get_demo_transactions()

        # Test 10: Get analytics
        self.test_get_analytics()

        # Print summary
        print("=" * 60)
        print(f"📊 Test Summary:")
        print(f"   Total Tests: {self.tests_run}")
        print(f"   Passed: {self.tests_passed}")
        print(f"   Failed: {self.tests_run - self.tests_passed}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed. Check the details above.")
            return 1

def main():
    tester = DigitalPaymentAPITester()
    return tester.run_comprehensive_test()

if __name__ == "__main__":
    sys.exit(main())