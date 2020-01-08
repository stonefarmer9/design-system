import React from 'react'
import '@testing-library/jest-dom/extend-expect'

import { render, RenderResult, fireEvent } from '@testing-library/react'

import { DatePicker, StateObject } from './DatePicker'
import { DATEPICKER_PLACEMENT } from './constants'

const NOW = '2019-12-05T11:00:00.000Z'

function click(element: HTMLElement) {
  fireEvent.mouseDown(element)
  fireEvent.click(element)
}

describe('DatePicker', () => {
  let wrapper: RenderResult
  let startDate: Date
  let label: string
  let onChange: (data: StateObject) => void
  let onBlur: (e: React.FormEvent) => void
  let dateSpy: jest.SpyInstance

  beforeAll(() => {
    dateSpy = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(NOW).valueOf())
  })

  afterAll(() => {
    dateSpy.mockRestore()
  })

  describe('default props', () => {
    beforeEach(() => {
      startDate = new Date('12/01/2019')
      onChange = jest.fn()
      onBlur = jest.fn()

      wrapper = render(
        <>
          <DatePicker
            startDate={startDate}
            placement={DATEPICKER_PLACEMENT.BELOW}
            onChange={onChange}
            onBlur={onBlur}
          />
          <div data-testid="datepicker-outside" />
        </>
      )
    })

    it('renders the component', () => {
      expect(wrapper.queryByTestId('datepicker-wrapper')).toBeInTheDocument()
    })

    describe('when the end user focuses on the Input', () => {
      beforeEach(() => {
        wrapper.getByTestId('datepicker-input').focus()
      })

      it('shows the month', () => {
        expect(wrapper.getByTestId('datepicker-month-label').innerHTML).toBe(
          'December 2019'
        )
      })

      it('displays the container', () => {
        expect(
          wrapper.getByTestId('datepicker-input-wrapper').classList
        ).toContain('is-open')

        expect(wrapper.getByTestId('floating-box').classList).toContain(
          'is-visible'
        )
      })

      describe('and the end user clicks on the navigate month buttons', () => {
        describe('and clicks next', () => {
          beforeEach(() => {
            wrapper.getByTestId('datepicker-input').focus()

            click(wrapper.getAllByTestId('datepicker-nav-button')[1])
          })

          it('changes to the next month', () => {
            expect(
              wrapper.getByTestId('datepicker-month-label').innerHTML
            ).toBe('January 2020')
          })

          it('does not hide the container', () => {
            expect(
              wrapper.getByTestId('datepicker-input-wrapper').classList
            ).toContain('is-open')

            expect(wrapper.getByTestId('floating-box').classList).toContain(
              'is-visible'
            )
          })
        })

        describe('and clicks previous', () => {
          beforeEach(() => {
            wrapper.getByTestId('datepicker-input').focus()

            click(wrapper.getAllByTestId('datepicker-nav-button')[0])
          })

          it('changes to the previous month', () => {
            expect(
              wrapper.getByTestId('datepicker-month-label').innerHTML
            ).toBe('November 2019')
          })

          it('does not hide the container', () => {
            expect(
              wrapper.getByTestId('datepicker-input-wrapper').classList
            ).toContain('is-open')

            expect(wrapper.getByTestId('floating-box').classList).toContain(
              'is-visible'
            )
          })
        })

        describe('and clicks on a day', () => {
          beforeEach(() => {
            click(wrapper.getByTestId('datepicker-day-01'))
          })

          it('set the value of the component to this date', () => {
            expect(
              wrapper.getByTestId('datepicker-input').getAttribute('value')
            ).toBe('12/1/2019')
          })

          it('invokes the onChange callback', () => {
            expect(onChange).toHaveBeenCalledTimes(1)
            expect(onChange).toHaveBeenCalledWith({
              endDate: new Date('2019-12-01T00:00:00.000Z'),
              focusedInput: null,
              startDate: new Date('2019-12-01T00:00:00.000Z'),
            })
          })

          it('does not hide the container', () => {
            expect(
              wrapper.getByTestId('datepicker-input-wrapper').classList
            ).toContain('is-open')

            expect(wrapper.getByTestId('floating-box').classList).toContain(
              'is-visible'
            )
          })
        })

        describe('and clicks outside the date picker', () => {
          beforeEach(() => {
            fireEvent.mouseDown(wrapper.getByTestId('datepicker-outside'))
          })

          it('hides the container', () => {
            expect(
              wrapper.getByTestId('datepicker-input-wrapper').classList
            ).not.toContain('is-open')

            expect(wrapper.getByTestId('floating-box').classList).not.toContain(
              'is-visible'
            )
          })
        })
      })
    })
  })

  describe('when a custom label is provided', () => {
    beforeEach(() => {
      label = 'Custom Label'

      wrapper = render(
        <DatePicker label={label} placement={DATEPICKER_PLACEMENT.BELOW} />
      )
    })

    it('renders that label accordingly', () => {
      expect(wrapper.getByTestId('datepicker-label').innerHTML).toBe(label)
    })
  })
})
