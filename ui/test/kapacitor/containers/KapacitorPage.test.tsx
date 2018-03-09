import React from 'react'
import {KapacitorPage} from 'src/kapacitor/containers/KapacitorPage'
import KapacitorForm from 'src/kapacitor/components/KapacitorForm'
import KapacitorFormInput from 'src/kapacitor/components/KapacitorFormInput'
import {shallow} from 'enzyme'
import {getKapacitor} from 'src/shared/apis'

import {source, kapacitor} from 'test/resources'
import * as mocks from 'mocks/dummy'

jest.mock('src/shared/apis', () => require('mocks/shared/apis'))

const setup = (override = {}) => {
  const props = {
    source: source,
    addFlashMessage: () => {},
    kapacitor,
    router: {
      push: () => {},
      replace: () => {},
    },
    location: {pathname: '', hash: ''},
    params: {id: '', hash: ''},
    ...override,
  }

  const wrapper = shallow(<KapacitorPage {...props} />)

  return {
    wrapper,
    props,
  }
}

describe('Kapacitor.Containers.KapacitorPage', () => {
  describe('rendering', () => {
    it('renders the KapacitorPage', () => {
      const {wrapper} = setup()
      expect(wrapper.exists()).toBe(true)
    })

    it('renders the <KapacitorForm/>', async () => {
      const {wrapper} = setup()
      const form = wrapper.find(KapacitorForm)

      expect(form.exists()).toBe(true)
    })

    describe('if it is a new kapacitor', () => {
      it('display the default kapacitor data', async () => {
        const {wrapper} = setup()
        const state = wrapper.state()

        const form = wrapper.find(KapacitorForm)
        const url = form
          .dive()
          .findWhere(n => n.props().value === state.kapacitor.url)
        expect(url.exists()).toBe(true)
      })
    })
  })

  describe('user interactions ', () => {
    describe('entering the url', () => {
      it('renders the text that is inputted', () => {
        const {wrapper} = setup()
        const state = wrapper.state()
        const event = {target: {value: 'new/url/'}}

        wrapper.find(KapacitorFormInput)
        let inputElement = wrapper
          .find(KapacitorForm)
          .dive()
          .findWhere(n => n.props().value === state.kapacitor.url)
          .dive()
          .find('input')

        inputElement.simulate('change', event)
        wrapper.update()

        inputElement = wrapper
          .find(KapacitorForm)
          .dive()
          .findWhere(n => n.props().value === event.target.value)

        expect(inputElement.exists()).toBe(true)
      })
    })
  })

  describe('instance methods', () => {
    describe('componentDidMount', () => {
      describe('if it is a new kapacitor', () => {
        it('does not get the kapacitor', async () => {
          const {wrapper} = setup()
          await wrapper.instance().componentDidMount()
          expect(getKapacitor).not.toHaveBeenCalled()
        })
      })

      describe('if it is an existing kapacitor', () => {
        it('gets the kapacitor info and sets the appropriate state', async () => {
          const params = {id: '1', hash: ''}
          const {wrapper} = setup({params})

          await wrapper.instance().componentDidMount()

          expect(wrapper.state().exists).toBe(true)
          expect(wrapper.state().kapacitor).toEqual(mocks.kapacitor)
        })
      })
    })
  })
})
