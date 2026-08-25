import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import User from "../models/User.js"
import jwt from "jsonwebtoken"


//Route to register
export const registerUser = async(req,res)=>{
try {
    //Check Validation
    const errors = validationResult(req);

     if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const  {name , email , password} = req.body;
    const existingUser = await User.findOne({email});

     if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password,10);

     // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

} catch (error) {
    console.error('Register error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while creating account',
    });
}
}


//Route to login

export const loginUser = async(req,res)=>{
  try {
    //Check Validation
    const errors = validationResult(req);

     if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const {email,password} = req.body;

    const user = await User.findOne({email}).select("+password");

     if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    //Compare
    const isCorrectPassword = await bcrypt.compare(
      password,
      user.password
    )

     if (!isCorrectPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

     // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while logging in',
    });
  }
}


//Router to get me
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        addresses: req.user.addresses,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses')

    return res.status(200).json({
      success: true,
      addresses: user?.addresses || [],
    })
  } catch (error) {
    console.error('Get addresses error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching addresses',
    })
  }
}



export const addAddress = async (req, res) => {
  try {
    const {
      name,
      line1,
      city,
      state,
      pincode,
      phone,
      country = 'India',
      isDefault = false,
    } = req.body

    if (!name || !line1 || !city || !state || !pincode || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All address fields are required',
      })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    if (isDefault) {
      user.addresses.forEach((address) => {
        address.isDefault = false
      })
    }

    user.addresses.push({
      fullName: name,
      phone,
      addressLine: line1,
      city,
      state,
      postalCode: pincode,
      country,
      isDefault,
    })

    await user.save()

    return res.status(201).json({
      success: true,
      message: 'Address added successfully',
      addresses: user.addresses,
    })
  } catch (error) {
    console.error('Add address error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error while adding address',
    })
  }
}

export const removeAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    user.addresses = user.addresses.filter(
      (address) => address._id.toString() !== req.params.id
    )

    await user.save()

    return res.status(200).json({
      success: true,
      message: 'Address removed successfully',
      addresses: user.addresses,
    })
  } catch (error) {
    console.error('Remove address error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error while removing address',
    })
  }
}


export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    user.name = name
    user.email = email.toLowerCase().trim()

    await user.save()

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    console.error('Update profile error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
    })
  }
}