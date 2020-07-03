import React from 'react'
import classNames from 'classnames'
import { differenceInDays } from 'date-fns'

import { TimelineRowProps } from '.'
import { TimelineContext } from './context'
import { getKey, isOdd, formatPx } from './helpers'
import { NO_DATA_MESSAGE } from './constants'

export interface TimelineRowsProps extends ComponentWithClass {
  children:
    | React.ReactElement<TimelineRowProps>
    | React.ReactElement<TimelineRowProps>[]
  render?: (
    index: number,
    isOddNumber: boolean,
    offsetPx: string,
    widthPx: string
  ) => React.ReactNode
}

const noData = (
  <span className="timeline__empty" data-testid="timeline-no-data">
    {NO_DATA_MESSAGE}
  </span>
)

function renderDefault(
  index: number,
  isOddNumber: boolean,
  offsetPx: string,
  widthPx: string
) {
  const classes = classNames(
    'timeline__row-week',
    'timeline__row-week--renderDefault',
    {
      'timeline__row-week--alt': isOddNumber,
    }
  )

  return (
    <div
      className={classes}
      key={getKey('timeline-row-week', index)}
      style={{
        marginLeft: offsetPx,
        width: widthPx,
      }}
    />
  )
}

export const TimelineRows: React.FC<TimelineRowsProps> = ({
  children,
  className,
  render,
}) => {
  const childrenWithKey = React.Children.map(
    children,
    (child: React.ReactElement<TimelineRowProps>, index: number) =>
      React.cloneElement(child, {
        ...child.props,
        key: getKey('timeline-row', index),
      })
  )

  const hasChildren = childrenWithKey && childrenWithKey.length

  const mainClasses = classNames('timeline__main', className, {
    'timeline__main--renderDefault': !render,
  })

  const rowClasses = classNames('timeline__row-weeks', {
    'timeline__row-weeks--renderDefault': !render,
  })

  return (
    <main className={mainClasses}>
      {hasChildren && (
        <TimelineContext.Consumer>
          {({
            state: {
              months,
              weeks,
              endDate: timelineEndDate,
              options: { dayWidth },
            },
          }) => {
            const wrapperStyles = timelineEndDate
              ? {
                  width: formatPx(
                    dayWidth,
                    differenceInDays(timelineEndDate, months[0].startDate) + 1
                  ),
                  overflow: 'hidden',
                }
              : null

            return (
              <div
                className={rowClasses}
                style={wrapperStyles}
                data-testid="timeline-columns"
              >
                {weeks.map(({ startDate }, index) => {
                  const diff = differenceInDays(
                    new Date(startDate),
                    new Date(months[0].startDate)
                  )

                  const offsetPx = formatPx(
                    dayWidth,
                    diff < 0 ? -Math.abs(diff) : 0
                  )

                  const widthPx = formatPx(dayWidth, 7)

                  const isOddNumber = isOdd(index)

                  return render
                    ? render(index, isOddNumber, offsetPx, widthPx)
                    : renderDefault(index, isOddNumber, offsetPx, widthPx)
                })}
              </div>
            )
          }}
        </TimelineContext.Consumer>
      )}

      {hasChildren ? childrenWithKey : noData}
    </main>
  )
}

TimelineRows.displayName = 'Rows'
