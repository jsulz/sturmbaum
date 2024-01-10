from flask import Blueprint, render_template, jsonify
import sqlalchemy
from sturmbaum.db import database
from sturmbaum.model import SensorData
from datetime import datetime
from dateutil import tz

sb = Blueprint("sturmbaum", __name__, template_folder="templates")


@sb.route("/", methods=["GET"])
def home():
    return render_template("pages/home.html.jinja")


@sb.route("/sensor-data", methods=["GET"])
def sensor_data():
    # @TODO parse request.args so that we can change the SQL query
    pst = tz.gettz("America/Los_Angeles")
    today_now = datetime.utcnow().date()
    today = datetime(
        today_now.year,
        today_now.month,
        today_now.day,
        hour=0,
        minute=0,
        second=0,
    ).astimezone(pst)
    today = today.timestamp() - 57600
    print(today)
    with database.connect() as conn:
        """
        stmt = (
            sqlalchemy.select(SensorData)
            .order_by(SensorData.published)
            .filter(SensorData.published > today)
        )
        """
        stmt = sqlalchemy.select(SensorData).order_by(SensorData.published)
        result = conn.execute(stmt).all()
        final = []
        for row in conn.execute(stmt).all():
            final.append(
                {
                    "published": row[1],
                    "humidity": row[2],
                    "airtemp": row[3],
                    "pressure": row[4],
                    "windspeed": row[5],
                    "winddirection": row[6],
                    "soiltemp": row[7],
                    "soilmoisture": row[8],
                    "rainfall": row[9],
                }
            )

    return jsonify(final)
