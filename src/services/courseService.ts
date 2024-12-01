import CourseModel,{Course} from '../models/Course'
import LectureModel,{Lecture} from '../models/Course'
import QuestionModel,{Question} from '../models/Course'
import UserModel from '../models/User';
import mongoose from 'mongoose';

export const addNewCourse = async (code: string, title: string, userId: string): Promise<Course> => {
    try {
     
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const newCourse = new CourseModel({
            code,
            title,
            created_by: {
                user_id: user._id,
                fullname: user.fullname,
                email: user.email,
            },
            lectures: [],
        });
    
        return await newCourse.save();
    } catch (error: any) {
        throw new Error('Error adding course: ' + error.message);
    }
};


export const addLectureToCourse = async (courseId: string, lectureData: Lecture): Promise<Course | null> => {
    try {
        const course = await CourseModel.findById(courseId);
        if (!course) {
            throw new Error('Course not found');
        }        
        course.lectures.push(lectureData);
        const updatedCourse = await course.save();
        return updatedCourse;
    } catch (error: any) {
        throw new Error('Error adding lecture to course: ' + error.message);
    }
};

// export const addQuestionToLecture = async (
//     courseId: string,
//     lectureId: string,
//     question: string
// ): Promise<Course | null> => {
//     try {
//         const course = await CourseModel.findById(courseId);
//         if (!course) {
//             throw new Error('Course not found');
//         }

//         const lecture = course.lectures.id(lectureId);
//         if (!lecture) {
//             throw new Error('Lecture not found');
//         }

//         lecture.questions.push({ question });
//         const updatedCourse = await course.save();
//         return updatedCourse;
//     } catch (error: any) {
//         throw new Error(`Error adding question to lecture: ${error.message}`);
//     }
// };

export const addQuestionToLecture = async (
    courseId: string,
    lectureId: string,
    questionData: { question: string; due_date?: string }
): Promise<Course | null> => {
    try {
        const course = await CourseModel.findById(courseId);
        if (!course) {
            throw new Error('Course not found');
        }

        const lecture = course.lectures.id(lectureId);
        if (!lecture) {
            throw new Error('Lecture not found');
        }
     
        lecture.questions.push({
            question: questionData.question,
            due_date: questionData.due_date ? new Date(questionData.due_date) : undefined,
        });

        const updatedCourse = await course.save();
        return updatedCourse;
    } catch (error: any) {
        throw new Error('Error adding question to lecture: ' + error.message);
    }
};

export const getQuestionsForLecture = async (
    courseId: string,
    lectureId: string,
    page: number = 1,
    limit: number = 10
): Promise<{ questions: any[]; totalQuestions: number }> => {
    try {
        const skip = (page - 1) * limit;

        const result = await CourseModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(courseId) } },  // Corrected ObjectId usage
            { $unwind: { path: '$lectures', preserveNullAndEmptyArrays: true } },
            { $match: { 'lectures._id': new mongoose.Types.ObjectId(lectureId) } },
            { $project: { questions: '$lectures.questions' } },
            { $unwind: { path: '$questions', preserveNullAndEmptyArrays: true } },
            {
                $facet: {
                    paginatedResults: [
                        { $skip: skip },
                        { $limit: limit },
                    ],
                    totalCount: [{ $count: 'count' }],
                },
            },
        ]);

        const questions = result[0]?.paginatedResults || [];
        const totalQuestions = result[0]?.totalCount[0]?.count || 0;

        return { questions, totalQuestions };
    } catch (error: any) {
        throw new Error(`Error retrieving questions: ${error.message}`);
    }
};


export const findQuestionById = async (
    courseId: string,
    lectureId: string,
    questionId: string
) => {
    try {
        const result = await CourseModel.aggregate([
            { $match: { _id: courseId } }, 
            { $unwind: '$lectures' },
            { $match: { 'lectures._id': lectureId } }, 
            { $unwind: '$lectures.questions' },
            { $match: { 'lectures.questions._id': questionId } }, 
            { $replaceRoot: { newRoot: '$lectures.questions' } }, 
        ]);

        if (result.length === 0) {
            throw new Error('Question not found');
        }

        return result[0];
    } catch (error: any) {
        throw new Error(`Error finding question: ${error.message}`);
    }
};

export const updateQuestionById = async (
    courseId: string,
    lectureId: string,
    questionId: string
) => {
    try {
        const result = await CourseModel.findOneAndUpdate(
            {
                _id: courseId,
                'lectures._id': lectureId,
                'lectures.questions._id': questionId,
            },
            {
                $set: { 'lectures.$[lecture].questions.$[question].due_date': Date.now() + 86400000 },
            },
            {
                arrayFilters: [
                    { 'lecture._id': lectureId },
                    { 'question._id': questionId },
                ],
                new: true,
            }
        );

        if (!result) {
            throw new Error('Question not found');
        }

        return result;
    } catch (error: any) {
        throw new Error(`Error updating question: ${error.message}`);
    }
};


export const updateAllQuestionsInLecture = async (courseId: string, lectureId: string) => {
    try {
        const result = await CourseModel.updateOne(
            { _id: courseId, 'lectures._id': lectureId },
            { $inc: { 'lectures.$.questions.$[].due_date': 86400000 } }
        );

        if (result.modifiedCount  === 0) {
            throw new Error('No questions updated');
        }

        return result;
    } catch (error: any) {
        throw new Error(`Error updating all questions: ${error.message}`);
    }
};

export const deleteQuestionById = async (
    courseId: string,
    lectureId: string,
    questionId: string
) => {
    try {
        const result = await CourseModel.updateOne(
            { _id: courseId, 'lectures._id': lectureId },
            { $pull: { 'lectures.$.questions': { _id: questionId } } }
        );

        if (result.modifiedCount  === 0) {
            throw new Error('Question not found or not deleted');
        }

        return result;
    } catch (error: any) {
        throw new Error(`Error deleting question: ${error.message}`);
    }
};

export const findNearestUsersWithHobbies = async (
    location: [number, number],
    hobbies: string[],
    maxDistance: number = 10000 
) => {
    try {
        const users = await UserModel.aggregate([
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: location },
                    distanceField: 'distance',
                    maxDistance: maxDistance,
                    spherical: true,
                    query: { hobbies: { $in: hobbies } },
                },
            },
            { $limit: 10 },
        ]);

        return users;
    } catch (error: any) {
        throw new Error(`Error finding nearest users: ${error.message}`);
    }
};