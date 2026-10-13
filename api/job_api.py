import os
import requests
from dotenv import load_dotenv

load_dotenv()

APP_ID = os.getenv("ADZUNA_APP_ID")
APP_KEY = os.getenv("ADZUNA_APP_KEY")

BASE_URL = "https://api.adzuna.com/v1/api"


def fetch_jobs(
    country="in",
    page=1,
    results_per_page=50,
    keyword="software developer",
    location="India"
):
    """
    Fetch latest job postings from Adzuna API.
    """

    url = f"{BASE_URL}/jobs/{country}/search/{page}"

    params = {
        "app_id": APP_ID,
        "app_key": APP_KEY,
        "results_per_page": results_per_page,
        "what": keyword,
        "where": location,
        "content-type": "application/json"
    }

    try:
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()

        data = response.json()

        jobs = []

        for job in data.get("results", []):
            jobs.append({
                "id": job.get("id"),
                "title": job.get("title"),
                "company": job.get("company", {}).get(
                    "display_name", "Unknown"
                ),
                "location": job.get("location", {}).get(
                    "display_name", "Unknown"
                ),
                "description": job.get("description", ""),
                "category": job.get("category", {}).get(
                    "label", "Unknown"
                ),
                "contract_type": job.get("contract_type"),
                "contract_time": job.get("contract_time"),
                "salary_min": job.get("salary_min"),
                "salary_max": job.get("salary_max"),
                "created": job.get("created"),
                "url": job.get("redirect_url")
            })

        return jobs

    except requests.RequestException as error:
        print("Adzuna API Error:", error)
        return []
