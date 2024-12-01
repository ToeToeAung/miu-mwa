import { Request, Response } from 'express';
import { addNewCourse,
    addLectureToCourse,
    addQuestionToLecture,
    getQuestionsForLecture,
    findQuestionById,
    updateQuestionById,
    updateAllQuestionsInLecture,
    deleteQuestionById,
    findNearestUsersWithHobbies } from '../services/courseService';

export const createCourse = async (req: Request, res: Response) => {
    try {        
        const { code, title, userId } = req.body;
        if (!code || !title || !userId) {
            return res.status(400).json({ error: 'Code, title, and userId are required' });
        }

        const newCourse = await addNewCourse(code, title, userId);

        return res.status(201).json(newCourse);
    } catch (error: any) {        
        return res.status(500).json({ error: error.message });
    }
};

export const createLecturer = async (req: Request, res: Response) => {
    try {
        const { courseId, lecture } = req.body;
      
        if (!courseId || !lecture || !lecture.title || !lecture.description) {
            return res.status(400).json({ error: 'Course ID, lecture title, and description are required' });
        }     
        const updatedCourse = await addLectureToCourse(courseId, lecture);
        res.status(200).json(updatedCourse);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createQuestion = async (req: Request, res: Response) => {
    const { courseId, lectureId, question } = req.body;

    if (!courseId || !lectureId || !question) {
        return res.status(400).json({ message: 'courseId, lectureId, and question are required.' });
    }

    try {
        const updatedCourse = await addQuestionToLecture(courseId, lectureId, question);
        res.status(201).json(updatedCourse);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


export const getQuestions = async (req: Request, res: Response) => {
    const { courseId, lectureId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!courseId || !lectureId) {
        return res.status(400).json({ message: 'courseId and lectureId are required.' });
    }

    try {
        const { questions, totalQuestions } = await getQuestionsForLecture(
            courseId,
            lectureId,
            parseInt(page as string),
            parseInt(limit as string)
        );

        res.status(200).json({
            questions,
            totalQuestions,
            currentPage: parseInt(page as string),
            totalPages: Math.ceil(totalQuestions / parseInt(limit as string)),
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getQuestion = async (req: Request, res: Response) => {
    const { courseId, lectureId, questionId } = req.params;

    try {
        const question = await findQuestionById(courseId, lectureId, questionId);
        res.status(200).json(question);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateQuestion = async (req: Request, res: Response) => {
    const { courseId, lectureId, questionId } = req.params;

    try {
        const updatedCourse = await updateQuestionById(courseId, lectureId, questionId);
        res.status(200).json(updatedCourse);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


export const updateAllQuestions = async (req: Request, res: Response) => {
    const { courseId, lectureId } = req.params;

    try {
        const result = await updateAllQuestionsInLecture(courseId, lectureId);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteQuestion = async (req: Request, res: Response) => {
    const { courseId, lectureId, questionId } = req.params;

    try {
        const result = await deleteQuestionById(courseId, lectureId, questionId);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


export const getNearestUsers = async (req: Request, res: Response) => {
    const { lat, lng, hobbies } = req.query;
    const maxDistance = parseInt(req.query.maxDistance as string) || 10000;

    if (!lat || !lng || !hobbies) {
        return res.status(400).json({ message: 'lat, lng, and hobbies are required.' });
    }

    try {
        const users = await findNearestUsersWithHobbies(
            [parseFloat(lat as string), parseFloat(lng as string)],
            (hobbies as string).split(','),
            maxDistance
        );
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};