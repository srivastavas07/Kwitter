import { Notification } from "../models/notificationSchema.js";
import { Tweet } from "../models/tweetSchema.js";
import { User } from "../models/userSchema.js";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import { original } from "../utils/constants.js";

export const createTweet = async (req, res) => {
    try {
        const { description, id } = req.body;
        if (!description || !id) {
            return res.status(401).json({
                message: "All fields required.",
                success: false,
            })
        }
        //what i want is only the logged in user can create the tweet. that is userId and id passed should match.
        const token = req.cookies.token;
        const match = jwt.verify(token, process.env.TOKEN_SECRET);
        const userDetails = await User.findById(id).select('-password');

        if (match.userId !== id) {
            return res.status(401).json({
                message: "Unauthorized user.",
                success: true,
            })
        }
        await Tweet.create({
            description,
            userId: id,
            userDetails: userDetails
        })
        return res.status(201).json({
            message: "Tweet Created Successfully.",
            success: true,
        })
    } catch (err) {
        console.log(err)
    }
}
export const TweetReply = async (req, res) => {
    try {
        const { description, id, tweetId } = req.body;
        //id = id of the user doing comment
        if (!description || !id || !tweetId) {
            return res.status(401).json({
                message: "All fields are Required.",
                success: false,
            })
        }
        const parentTweet = await Tweet.findById(tweetId);
        const userDetails = await User.findById(id).select('-password');

        if (!parentTweet) {
            return res.status(404).json({
                message: "Tweet not found.",
                success: false,
            })
        }
        const replyTweet = await Tweet.create({
            description,
            userId: id,
            parentId: tweetId,
            userDetails: userDetails,

        })
        //in parentTweet comment array push replyTweet.id
        //and also filter comment array by removing all the ids of deleted tweets.
        const getNullComments = await Promise.all(parentTweet.comments.map(async (id) => {
            const currentTweet = await Tweet.findById(id);
            return currentTweet ? id : null;
        }))
        const filtered = getNullComments.filter((id) => id !== null);
        parentTweet.comments = filtered;
        parentTweet.comments.push(replyTweet._id);
        await parentTweet.save();
        const actor = await User.findById(id);
        if (actor._id.toString() !== parentTweet.userId.toString()) {
            await Notification.create({
                actorName: actor.name,
                actorProfilePhoto: actor.profilePhoto,
                description: actor.name + " commented on your tweet. ",
                targetTweetLink: `${original}/comments/${tweetId}`,
                userId: parentTweet.userId,
            })
        }
        return res.status(200).json({
            message: "Tweet replied successfully.",
            success: true,
        });

    } catch (error) {
        console.log(error);
    }
}
export const deleteTweet = async (req, res) => {
    try {
        const { id } = req.params;
        await Tweet.findByIdAndDelete(id);
        await Tweet.updateMany(
            { comments: mongoose.Types.ObjectId.createFromHexString(id) },
            { $pull: { comments: mongoose.Types.ObjectId.createFromHexString(id) } }

            //this will convert the object id to normal string..
            // Using mongoose.Types.ObjectId.createFromHexString(id): 
            //This method explicitly converts the id to an ObjectId using the hexadecimal string format. 
            //It ensures compatibility and correctness when querying and updating MongoDB documents.
        );
        await User.updateMany(
            { bookmark: id },
            { $pull: { bookmark: id } }
        );
        return res.status(200).json({
            message: "Tweet Deleted Successfully.",
            success: true,
        })
    } catch (err) {
        console.log(err);
    }
}
export const likeOrDislike = async (req, res) => {
    try {
        const loggedInUser = req.body.id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId);
        const actor = await User.findById(loggedInUser);

        if (!tweet) {
            return res.status(404).json({
                message: "Tweet not found.",
                success: false,
            });
        }
        console.log(loggedInUser);
        if (tweet.like.includes(loggedInUser)) {
            await Tweet.findByIdAndUpdate(tweetId, { $pull: { like: loggedInUser } })
            return res.status(200).json({
                message: "Tweet has been disliked.",
                success: false,
            })
        } else {

            await Tweet.findByIdAndUpdate(tweetId, { $push: { like: loggedInUser } });
            if (actor._id.toString() !== tweet.userId.toString()) {
                await Notification.create({
                    actorName: actor.name,
                    actorProfilePhoto: actor.profilePhoto,
                    description: actor.name + " liked your Tweet. ",
                    targetTweetLink: `${original}/comments/${tweetId}`,
                    userId: tweet?.userId,
                })
            }
            return res.status(200).json({
                message: "Tweet has been Liked.",
                success: true
            })
        }
    } catch (error) {
        console.log(error);
    }
}
export const getAllTweets = async (req, res) => {
    try {
        //loggedInUser tweet + tweet of all the people im following.
        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        const loggedInUserTweets = await Tweet.find({ userId: id, parentId: null });
        console.log(loggedInUser);
        const followingTweets = await Promise.all(loggedInUser.following.map((otherUserId) => {
            return Tweet.find({ userId: otherUserId, parentId: null });
        }))
        return res.status(201).json({
            tweets: loggedInUserTweets.concat(...followingTweets),
        })
    } catch (error) { console.log(error) }
}
export const getFollowingTweets = async (req, res) => {
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        const followingTweets = await Promise.all(loggedInUser.following.map((otherUserId) => {
            return Tweet.find({ userId: otherUserId, parentId: null });
        }))
        return res.status(201).json({
            tweets: [].concat(...followingTweets),
        })
    } catch (error) { console.log(error) }
}
export const bookmarkedTweets = async (req, res) => {
    try {
        const userId = req.params.id;
        const loggedInUser = await User.findById(userId);
        const bookmarkedTweets = await Promise.all(loggedInUser.bookmark.map((tweetID) => {
            return Tweet.findById(tweetID);
        }));
        return res.status(201).json({
            tweets: [].concat(...bookmarkedTweets),
            success: true,
        })
    } catch (error) { console.log(error) }
}
export const getUserTweets = async (req, res) => {
    try {
        const id = req.params.id;
        const userTweets = await Tweet.find({ userId: id, parentId: null });
        return res.status(201).json({
            tweets: [].concat(...userTweets),
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}

export const getLikedUsers = async (req, res) => {
    try {
        const tweetId = req.params.id;
        console.log(`Fetching tweet with ID: ${tweetId}`);

        // Find the tweet by ID and return a plain JavaScript object
        const tweet = await Tweet.findById(tweetId).lean().exec();

        if (!tweet) {
            console.log('Tweet not found');
            return res.status(404).json({ message: 'Tweet not found' });
        }

        // Extract the user IDs from the like array
        const userIds = tweet.like.map(id => (id));
        console.log(`User IDs who liked the tweet: ${userIds}`);

        // Fetch user details for the extracted IDs
        const users = await User.find({ _id: { $in: userIds } }).select('name profilePhoto username');
        console.log(`Users found: ${users}`);

        // Map user details to the like array
        const usersWithDetails = tweet.like.map(id => {
            const user = users.find(u => u._id.toString() === id.toString());
            if (user) {
                return {
                    _id: user._id,
                    name: user.name,
                    profilePhoto: user.profilePhoto,
                    username: user.username,
                };
            }
        });

        //   You are correct that the variable users already contains all the necessary user details. 
        //   If you don't need to maintain the order of likes as they appear in the tweet.like array or if you don't have 
        //   additional processing requirements based on the order, you can simplify the code. Instead of mapping the users 
        //   array to the tweet.like array, you can directly return the users array.

        return res.json(usersWithDetails);
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ error: 'An error occurred while fetching likes' });
    }
};
export const getTweetComments = async (req, res) => {
    try {
        const { id } = req.params;
        const tweet = await Tweet.findById(id);
        const tweetComments = await Promise.all(tweet.comments.map((commentId) => {
            return Tweet.findById(commentId);
        }))
        if (!tweet) {
            return res.status(404).json({
                message: "Tweet not found.",
                success: false,
            })
        }
        console.log(tweet);
        return res.status(200).json({
            tweet: tweet,
            success: true,
            tweetComments: [].concat(...tweetComments),
        })
    } catch (error) {
        console.log(error);
    }
}