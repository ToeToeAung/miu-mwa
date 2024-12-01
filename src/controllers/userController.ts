import { Request, Response } from 'express';
import { addNewUser } from '../services/userService';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
      res.status(400).json({ error: 'Fullname, email, and password are required.' });
      return;
  }
  try {
 
      const user = await addNewUser(fullname, email, password);
      res.status(201).json({
          message: 'User created successfully.',
          user: {
             // id: user._id,
              fullname: user.fullname,
              email: user.email,
              location: user.location
          }
      });
  } catch (error: any) {     
      if (error.message.includes('Email already exists')) {
          res.status(409).json({ error: error.message });
          return;
      }
      res.status(500).json({ error: error.message || 'An unknown error occurred.' });
  }
};



