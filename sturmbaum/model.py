from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class SensorData(Base):
    __tablename__ = "sensor_data"

    id: Mapped[int] = mapped_column(primary_key=True)
    published: Mapped[int]
    humidity: Mapped[float]
    airtemp: Mapped[float]
    pressure: Mapped[float]
    windspeed: Mapped[float]
    winddirection: Mapped[float]
    soiltemp: Mapped[float]
    soilmoisture: Mapped[float]
    rainfall: Mapped[float]
    batterycharge: Mapped[float]
