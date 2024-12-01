import UserModel,{User} from '../models/User'

export async function addNewUser(fullname: string, email: string, password: string): Promise<User> {
  const defaultLocation = [-91.96731488465576, 41.018654231616374];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      throw new Error('Invalid email format: ' + email);
  }

  try {
      const existingUser = await UserModel.findOne({ email }).exec();
      if (existingUser) {
          throw new Error('Email already exists: ' + email);
      }
      const newUser = new UserModel({
          fullname,
          email,
          password,
          location: defaultLocation
      });
      const savedUser = await newUser.save();
      return savedUser;
  } catch (error: any) {
      if (error.name === 'ValidationError') {
          throw new Error('Validation failed: ' + error.message);
      }
      throw new Error('Error adding user: ' + error.message);
  }
}