from flask import Flask, render_template
import csv

app = Flask(__name__)

# ==========================================
# TOP 10 JOBS FROM CSV
# ==========================================

def get_top_jobs():

    jobs = []

    try:

        with open("static/jobs.csv", "r", encoding="utf-8") as file:

            reader = csv.DictReader(file)

            for row in reader:

                if "Job Title" in row:
                    jobs.append(row["Job Title"])

    except Exception as e:

        print("Error:", e)

    unique_jobs = list(dict.fromkeys(jobs))

    return unique_jobs[:10]

# ==========================================
# LOGIN PAGE
# ==========================================

@app.route("/")
def login():

    return render_template("login.html")

# ==========================================
# HOME PAGE
# ==========================================

@app.route("/home")
def home():

    top_jobs = get_top_jobs()

    return render_template(
        "home.html",
        top_jobs=top_jobs
    )

# ==========================================
# DASHBOARD PAGE
# ==========================================

@app.route("/dashboard")
def dashboard():

    return render_template("index.html")

# ==========================================
# MAIN
# ==========================================

if __name__ == "__main__":

    app.run(
        debug=True
    )