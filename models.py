"""
PostgreSQL Database Models using SQLAlchemy & pgvector
Architecture for Government Job AI Navigator
"""

from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey, Text, Enum
from sqlalchemy.orm import declarative_base, relationship
from pgvector.sqlalchemy import Vector

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    age = Column(Integer, nullable=False)
    state = Column(String(100), nullable=False)
    language = Column(String(20), default="en") # 'en' or 'ta'

    educations = relationship("Education", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user")


class Education(Base):
    __tablename__ = "education"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    degree = Column(String(100), nullable=False) # e.g. 'B.Com', 'B.Tech', '10th'
    specialization = Column(String(150), nullable=True) # e.g. 'Computer Science'
    percentage = Column(Numeric(5, 2), nullable=False)

    user = relationship("User", back_populates="educations")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    organization = Column(String(200), nullable=False)
    department = Column(String(200), nullable=True)
    location = Column(String(100), nullable=False) # 'Tamil Nadu', 'All India'
    salary = Column(String(100), nullable=False)
    application_start = Column(Date, nullable=False)
    application_end = Column(Date, nullable=False)
    official_url = Column(Text, nullable=False)

    eligibility_rule = relationship("EligibilityRule", back_populates="job", uselist=False)
    notifications = relationship("Notification", back_populates="job")
    chunks = relationship("NotificationChunk", back_populates="job")
    applications = relationship("Application", back_populates="job")


class EligibilityRule(Base):
    __tablename__ = "eligibility_rules"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String(50), ForeignKey("jobs.id"), nullable=False)
    min_age = Column(Integer, nullable=False)
    max_age = Column(Integer, nullable=False)
    qualification = Column(String(255), nullable=False) # e.g. 'Any Bachelor Degree'
    experience = Column(Integer, default=0) # in years
    other_requirements = Column(Text, nullable=True)

    job = relationship("Job", back_populates="eligibility_rule")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String(50), ForeignKey("jobs.id"), nullable=False)
    pdf_url = Column(Text, nullable=False)
    published_date = Column(Date, nullable=False)

    job = relationship("Job", back_populates="notifications")


class NotificationChunk(Base):
    __tablename__ = "notification_chunks"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String(50), ForeignKey("jobs.id"), nullable=False)
    chunk_text = Column(Text, nullable=False)
    embedding = Column(Vector(1536), nullable=True) # pgvector embeddings

    job = relationship("Job", back_populates="chunks")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(String(50), ForeignKey("jobs.id"), nullable=False)
    status = Column(String(50), default="Applied") # 'Applied', 'Shortlisted', 'Rejected'

    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")
