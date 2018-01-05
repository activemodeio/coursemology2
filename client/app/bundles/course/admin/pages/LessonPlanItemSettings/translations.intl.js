import { defineMessages } from 'react-intl';

const translations = defineMessages({
  assessmentTab: {
    id: 'course.admin.LessonPlanItemSettings.assessmentTab',
    defaultMessage: 'Assessment Tab',
  },
  enabled: {
    id: 'course.admin.LessonPlanItemSettings.enabled',
    defaultMessage: 'Show on Lesson Plan',
  },
  lessonPlanItemSettings: {
    id: 'course.admin.lessonPlanSettings.lessonPlanItemSettings',
    defaultMessage: 'Lesson Plan Item Settings',
  },
  visible: {
    id: 'course.admin.LessonPlanItemSettings.visible',
    defaultMessage: 'Visible by Default',
  },
  updateSuccess: {
    id: 'course.admin.LessonPlanItemSettings.updateSuccess',
    defaultMessage: 'Setting for "{setting}" updated.',
  },
  updateFailure: {
    id: 'course.admin.LessonPlanItemSettings.updateFailure',
    defaultMessage: 'Failed to update setting for "{setting}".',
  },
  noLessonPlanItems: {
    id: 'course.admin.LessonPlanItemSettings.noLessonPlanItems',
    defaultMessage: 'There are no lesson plan items to configure for lesson plan display.',
  },
  assessmentCategory: {
    id: 'course.admin.LessonPlanItemSettings.assessmentCategory',
    defaultMessage: 'Assessment Category',
  },
});

export default translations;
