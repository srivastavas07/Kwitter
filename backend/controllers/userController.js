import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import { Notification } from "../models/notificationSchema.js";
import jwt from "jsonwebtoken";
import { original } from "../utils/constants.js";
export const Register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(401).json({
                message: "All fields are required..!!",
                success: false
            })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "User already exists..!!",
                success: false
            })
        }
        const hashedPassword = await bcryptjs.hash(password, 16);
        await User.create({ name, username, email, password: hashedPassword })
        return res.status(200).json({
            message: "Account Created Successfully..!!",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const LoginUsingGoogle = async (req, res) => {
    try {
        const { name, email, username, profilePhoto } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
            return res.status(201).cookie("token", token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day expiration
            }).json({
                message: `Welcome back ${user.name}!`,
                success: true,
                user
            })
        } else {
            const passwordRandom = username + "pass";
            const hashedPassword = await bcryptjs.hash(passwordRandom, 16);
            const user = await User.create({ name, email, username, profilePhoto, password: hashedPassword });
            const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
            return res.status(201).cookie("token", token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day expiration
            }).json({
                message: `Account Created Successfully. Welcome ${name}..!!`,
                success: true,
                user
            })
        }

    } catch (error) {
        console.log(error);
    }
}
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //this will take response from the current user what ever he enters.
        if (!email || !password) {
            // if user does not enter anything..or any one field remains empty.
            return res.status(401).json({
                message: "All fields are required..!!",
                success: false
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "User does not exists..!!",
                success: false
            })
        }
        console.log(user);
        //if the user exits then we will check the password.
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password.!",
                success: false
            })
        }
        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
        return res.status(201).cookie("token", token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day expiration
        }).json({
            message: `Welcome back ${user.name}!`,
            success: true,
            user
        });
    } catch (error) {
        return res.status(401).json({
            message:"Something went Wrong..!!",
            success:false,
        })
        console.log(error);
    }
}
export const LogOut = (req, res) => {
    return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
        message: "Logged out successfully..!!",
        success: true
    })
}
export const bookmark = async (req, res) => {
    try {
        const loggedInUser = req.body.id;
        const tweetId = req.params.id;
        const collection = await User.findById(loggedInUser);
        console.log(collection);
        if (collection.bookmark.includes(tweetId)) {
            await User.findByIdAndUpdate(loggedInUser, { $pull: { bookmark: tweetId } })
            return res.status(200).json({
                message: "Bookmark removed.",
                success: true
            })
        } else {
            await User.findByIdAndUpdate(loggedInUser, { $push: { bookmark: tweetId } })
            return res.status(200).json({
                message: "Tweet Bookmarked.",
                success: true
            })
        }
    } catch (error) {
        console.log(error);
    }


}
export const getProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select("-password");
        if (user) {
            return res.status(200).json({
                user
            })
        }
        return res.status(401).json({
            message: "User not Found.",
            success: false
        })
    } catch (error) {
        console.log(error);
    }
}
export const otherUsers = async (req, res) => {
    try {
        const id = req.params.id;
        const otherUser = await User.find({ _id: { $ne: id } }).select("-password");
        if (!otherUsers) {
            return res.status(401).json({
                message: "Currently users unavailable.",
                success: false
            })
        }
        return res.status(201).json({
            otherUser,
        })
    } catch (error) {
        console.log(error);
    }
}
export const followUnfollow = async (req, res) => {
    try {
        const currentUser = req.body.id;
        //user to be followed.. 
        const target = req.params.id;
        //find the profile of the target
        const actor = await User.findById(currentUser);
        const targetUser = await User.findById(target);
        if (!targetUser) {
            return res.status(401).json({
                message: "User not Available",
                success: false,
            })
        }
        if (targetUser.followers.includes(currentUser)) {
            await User.findByIdAndUpdate(target, { $pull: { followers: currentUser } });
            await User.findByIdAndUpdate(currentUser, { $pull: { following: target } });
            return res.status(201).json({
                message: `${targetUser.name} has been unfollowed.`,
                success: false,
            })
        } else {
                await Notification.create({
                    actorName: actor.name,
                    actorProfilePhoto: actor.profilePhoto,
                    description: actor.name + " followed you. ",
                    targetTweetLink: `${original}/profile/${target}`,
                    userId: target,
                })
            await User.findByIdAndUpdate(target, { $push: { followers: currentUser } });
            await User.findByIdAndUpdate(currentUser, { $push: { following: target } });
            return res.status(201).json({
                message: `You just followed ${targetUser.name}.`,
                success: true
            })
        }
    } catch (error) {
        console.log(error);
    }
}
export const editProfile = async (req, res) => {
    try {
        const { name, username, email, password, confirmPassword, bio, profilePhoto, coverPhoto } = req.body;
        console.log("blah blah");
        const id = req.params.id;
        const user = await User.findById(id);
        var hashedPassword;
        console.log(password, confirmPassword);
        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                return res.status(400).json({
                    message: "Passwords do not match.",
                    success: false,
                });
            } else {
                hashedPassword = await bcryptjs.hash(password, 16);
            }
        } else if ((!password && confirmPassword) || (password && !confirmPassword)) {
            return res.status(400).json({
                message: "Password and Confirm Password both Required!",
                success: false,
            });
        } else if (!password && !confirmPassword) {
            hashedPassword = user.password;
        }

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false,
            })
        }
        await User.findByIdAndUpdate(id, { name, username, email, password: hashedPassword, bio, profilePhoto, coverPhoto }, { new: true }, { runValidators: true });
        return res.status(200).json({
            message: "Profile Updated Successfully.",
            success: true,
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Something went wrong.",
            success: false,
        })
    }
}
export const showFollowers = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).lean().exec();
        if (!user) {
            return res.status(400).json({
                message: "User Not Found",
                success: false,
            });
        }
        const userIds = user.followers.map((id) => id);
        const followers = await User.find({ _id: { $in: userIds } }).select("name profilePhoto username");
        return res.status(200).json({
            followers,
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}
export const showFollowing = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).lean().exec();
        if (!user) {
            return res.status(400).json({
                message: "User Not Found",
                success: false,
            });
        }
        const userIds = user.following.map((id) => id);
        const following = await User.find({ _id: { $in: userIds } }).select("name profilePhoto username");
        return res.status(200).json({
            following,
            success: true,
        })
    } catch (error) {
        console.log(error)
    }
}
export const searchUser = async (req, res) => {
    try {
        const searchValue = req.body.searchValue;
        console.log(searchValue);
        const users = await User.find({
            $or: [
                { name: { $regex: searchValue, $options: "i" } },
                { username: { $regex: searchValue, $options: "i" } },
                { email: { $regex: searchValue, $options: "i" } }
            ]
        }).select("name profilePhoto username email");

        return res.status(200).json({
            users,
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred", success: false });
    }
}
export const getNotification = async (req, res) => {
    try {
        const userID = req.params.id;
        const notifications = await Notification.find({ userId: userID });
        return res.status(200).json({
            notifications,
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}
