import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { injectIntl, defineMessages } from 'react-intl';
import { scroller } from 'react-scroll';
import { grey600 } from 'material-ui/styles/colors';
import styles from './LessonPlan.scss';
import LessonPlanNav from '../components/LessonPlanNav';
import LessonPlanFilter from '../components/LessonPlanFilter';
import LessonPlanGroup from '../components/LessonPlanGroup';

const translations = defineMessages({
  priorItemsMilestoneTitle: {
    id: 'course.lessonPlan.lessonPlan.priorItemsMilestoneTitle',
    defaultMessage: 'Prior Items',
    description: 'Title for prior items milestones',
  },
  emptyLessonPlanMessage: {
    id: 'course.lessonPlan.lessonPlan.emptyLessonPlanMessage',
    defaultMessage: 'The lesson plan is empty. Add a new event or milestone via the buttons on the top-right.',
    description: 'Informs user that the lesson plan is empty.',
  },
});

const propTypes = {
  milestones: PropTypes.instanceOf(Immutable.List).isRequired,
  items: PropTypes.instanceOf(Immutable.List).isRequired,
  hiddenItemTypes: PropTypes.instanceOf(Immutable.List).isRequired,
  toggleItemTypeVisibility: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

const inlineStyles = {
  emptyLessonPlanMessage: {
    color: grey600,
  },
};

class LessonPlan extends React.Component {
  /**
   * This method transforms a lesson plan item type into a standard string that is used as
   * a key when applying the filter
   *
   * @param {Array<String>}
   * @return {String}
   */
  static itemTypeKey(type) {
    return type.reverse().join(' - ');
  }

  componentDidMount() {
    const lastMilestone = this.lastPastMilestone();
    if (lastMilestone) {
      scroller.scrollTo(`milestone-group-${lastMilestone.get('id')}`, {
        duration: 200,
        delay: 100,
        smooth: true,
        offset: -100,
      });
    }
  }

  /**
   * Returns the last milestone that has passed.
   */
  lastPastMilestone() {
    const { milestones } = this.props;
    const dateNow = Date.now();
    return milestones.takeUntil(milestone => Date.parse(milestone.get('start_at')) > dateNow).last();
  }

  /**
   * Groups lesson plan items with their respective milestones into 'milestone groups'
   * and sorts items according to their types within each milestone group.
   */
  milestoneGroups() {
    const { milestones, items, hiddenItemTypes, intl } = this.props;

    const MILESTONE_CLASS_NAME = 'Course::LessonPlan::Milestone';
    const isMilestone = elem => elem.get('lesson_plan_element_class') === MILESTONE_CLASS_NAME;

    // Filter away items that the user has hidden
    const visibleItems = items.filter((item) => {
      const type = LessonPlan.itemTypeKey(item.get('lesson_plan_item_type'));
      return !hiddenItemTypes.includes(type);
    });

    // Combine milestones and visible items, then order them chronologically
    const sortedLessonPlanElements = milestones.concat(visibleItems)
      .map(elem => elem.merge({ start_at: Date.parse(elem.get('start_at')) }))
      .sortBy(elem => elem.get('start_at'));

    // Create a default milestone to hold items that precede the first milestone,
    // if one is needed.
    const seedGroup =
      sortedLessonPlanElements.isEmpty() || isMilestone(sortedLessonPlanElements.first()) ?
      [] :
      [{
        milestone: Immutable.fromJS({
          id: 'prior',
          title: intl.formatMessage(translations.priorItemsMilestoneTitle),
          start_at: sortedLessonPlanElements.first().get('start_at'),
        }),
        items: [],
      }];

    // Reducer method that takes a flat array of milestones and items,
    // and chunks them into milestone groups.
    const groupItemsWithMilestones = (result, elem) => {
      if (isMilestone(elem)) {
        result.push({ milestone: elem, items: [] });
      } else {
        result[result.length - 1].items.push(elem);
      }
      return result;
    };

    // Maps a milestone group with unsorted items to a duplicate group that has the items sorted.
    const sortItemsByType = (group) => {
      const { milestone } = group;
      const sortedItems =
        Immutable.fromJS(group.items).sortBy(item => item.get('lesson_plan_item_type'));
      return { milestone, items: sortedItems };
    };

    // Build the sorted milestone groups
    const groups = sortedLessonPlanElements
      .reduce(groupItemsWithMilestones, seedGroup)
      .map(sortItemsByType);

    return groups;
  }

  renderLessonPlan() {
    const { milestones, items, hiddenItemTypes, toggleItemTypeVisibility } = this.props;
    const milestoneGroups = this.milestoneGroups();

    return (
      <div className={styles.mainPanel}>
        {
          milestoneGroups.map(group =>
            <LessonPlanGroup
              key={group.milestone.get('id')}
              milestone={group.milestone}
              items={group.items}
              lessonPlanItemTypeKey={LessonPlan.itemTypeKey}
            />
          )
        }
        <div className={styles.navContainer}>
          <LessonPlanNav {...{ milestones }} />
          <LessonPlanFilter
            lessonPlanItemTypeKey={LessonPlan.itemTypeKey}
            {...{
              toggleItemTypeVisibility,
              hiddenItemTypes,
              items,
            }}
          />
        </div>
      </div>
    );
  }

  renderEmptyLessonPlanMessage() {
    const { intl } = this.props;

    return (
      <h4 style={inlineStyles.emptyLessonPlanMessage}>
        {intl.formatMessage(translations.emptyLessonPlanMessage)}
      </h4>
    );
  }

  render() {
    const { milestones, items } = this.props;

    return (
      milestones.size > 0 || items.size > 0 ?
      this.renderLessonPlan() :
      this.renderEmptyLessonPlanMessage()
    );
  }

}

LessonPlan.propTypes = propTypes;

export default injectIntl(LessonPlan);