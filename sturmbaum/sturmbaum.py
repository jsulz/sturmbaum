from flask import Blueprint, render_template

sb = Blueprint("sturmbaum", __name__, template_folder="templates")

@sb.route("/", methods=["GET"])
def home():
    return render_template("pages/home.html.jinja")