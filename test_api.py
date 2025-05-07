import requests
import json
import sys

API_URL = "http://localhost:5000"

def test_health():
    response = requests.get(f"{API_URL}/api/health")
    print("Health check:", response.status_code)
    print(json.dumps(response.json(), indent=2))
    return response.status_code == 200

def test_recommendations_for_user(user_id=1):
    params = {
        "latitude": 41.0082,
        "longitude": 28.9784,
        "top_n": 5
    }
    response = requests.get(f"{API_URL}/api/recommendations/user/{user_id}", params=params)
    print(f"Recommendations for user {user_id}:", response.status_code)
    if response.status_code == 200:
        data = response.json()
        print(f"Found {len(data['recommendations'])} recommendations")
        for i, rec in enumerate(data['recommendations']):
            print(f"  {i+1}. {rec['name']} (Score: {rec['score']:.2f})")
    else:
        print(json.dumps(response.json(), indent=2))
    return response.status_code == 200

def test_recommendations_for_new_user():
    params = {
        "latitude": 41.0082,
        "longitude": 28.9784,
        "top_n": 5
    }
    response = requests.get(f"{API_URL}/api/recommendations/new-user", params=params)
    print("Recommendations for new user:", response.status_code)
    if response.status_code == 200:
        data = response.json()
        print(f"Found {len(data['recommendations'])} recommendations")
        for i, rec in enumerate(data['recommendations']):
            print(f"  {i+1}. {rec['name']} (Score: {rec['score']:.2f})")
    else:
        print(json.dumps(response.json(), indent=2))
    return response.status_code == 200

if __name__ == "__main__":
    print("Testing Istanbul Guide API...")
    
    all_tests_passed = True
    
    # Test health check
    if not test_health():
        all_tests_passed = False
        print("❌ Health check test failed")
    else:
        print("✅ Health check test passed")
    
    print("\n" + "-"*50 + "\n")
    
    # Test recommendations for user
    if not test_recommendations_for_user():
        all_tests_passed = False
        print("❌ User recommendations test failed")
    else:
        print("✅ User recommendations test passed")
    
    print("\n" + "-"*50 + "\n")
    
    # Test recommendations for new user
    if not test_recommendations_for_new_user():
        all_tests_passed = False
        print("❌ New user recommendations test failed")
    else:
        print("✅ New user recommendations test passed")
    
    print("\n" + "-"*50 + "\n")
    
    if all_tests_passed:
        print("✅ All tests passed!")
        sys.exit(0)
    else:
        print("❌ Some tests failed!")
        sys.exit(1) 