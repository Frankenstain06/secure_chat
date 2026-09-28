from pydantic import BaseModel, ConfigDict, EmailStr, Field

class UserRegistrationIn(BaseModel):
    username: str = Field(
        min_length=3,
        max_length=50,
        pattern="^[a-zA-Z_]+$",
        description="Username must be alphanumeric and can include underscores.",)
    email: EmailStr = Field(
        description="Valid email address for user registration.",)
    password: str = Field(
        min_length=8,
        pattern="^[a-zA-Z0-9_]+$",
        description="Password must be at least 8 characters long.",)
    
    
class UserRegistrationOut(BaseModel):
    username: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)

