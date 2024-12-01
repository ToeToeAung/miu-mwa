import { Router } from 'express';
import { createCourse,
        createLecturer,
        createQuestion,
        getQuestions,
        getQuestion,
        updateQuestion,
        updateAllQuestions,
        deleteQuestion,
        getNearestUsers
        } from '../controllers/courseController';

const router = Router();

router.post('/', createCourse as any);
router.post('/:courseId/lectures', createLecturer as any);
router.post('/question', createQuestion as any); 
router.post('/:courseId/lectures/:lectureId/questions', createQuestion as any); 
router.get('/:courseId/lectures/:lectureId', getQuestions as any);
router.get('/:courseId/lectures/:lectureId/questions/:questionId', getQuestion as any);
router.put('/:courseId/lectures/:lectureId/questions/:questionId', updateQuestion);
router.put('/:courseId/lectures/:lectureId/questions', updateAllQuestions);
router.delete('/:courseId/lectures/:lectureId/questions/:questionId', deleteQuestion);
router.get('/users/nearest', getNearestUsers as any);

export default router;