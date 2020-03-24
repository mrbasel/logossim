import React, { useEffect } from 'react';
import Tooltip from 'react-tooltip';
import styled from 'styled-components';
import { Formik, Form, Field } from 'formik';

import { Header, Content, IconButton } from './ComponentLayout';
import { Back, Close } from '../Icons';
import DraggableComponent from './DraggableComponent';
import ComponentConfigurationInput from './ComponentConfigurationInput';

const DragArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 200px;
  margin-bottom: 32px;

  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
  background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.1) 1px,
      transparent 1px,
      transparent 15px,
      rgba(0, 0, 0, 0.05) 15px,
      transparent 16px,
      transparent 30px,
      rgba(0, 0, 0, 0.05) 30px,
      transparent 31px
    ),
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1) 1px,
      transparent 1px,
      transparent 15px,
      rgba(0, 0, 0, 0.05) 15px,
      transparent 16px,
      transparent 30px,
      rgba(0, 0, 0, 0.05) 30px,
      transparent 31px
    );
  background-size: 45px 45px;
  border-radius: 25px;
`;

const Title = styled.h1`
  flex-grow: 1;
  font-size: 1.5em;

  margin: 0;

  align-self: center;
  text-align: center;
`;

const FormScroll = styled.form`
  height: 375px;
  overflow-y: auto;
`;

const Footer = styled.div`
  display: flex;
`;

const Hint = styled.span`
  font-size: 0.8em;
  font-style: italic;
  align-self: center;
  text-align: right;
  margin-right: 10px;
`;

const SubmitButton = styled.button.attrs(({ ...props }) => ({
  ...props,
  type: 'submit',
}))`
  border: none;
  border-radius: 5px;
  background: #07d26b;

  color: white;
  font-size: 1.2em;

  width: 100%;
  padding: 5px 20px;
  margin: 5px;
`;

const getInitialValues = component =>
  Object.fromEntries(
    component.configurations.map(configuration => [
      configuration.name,
      configuration.default,
    ]),
  );

const ComponentConfiguration = ({
  component,
  handleClose,
  handleBack,
  handleComponentDrop,
}) => {
  useEffect(Tooltip.rebuild);

  return (
    <>
      <Header>
        <IconButton
          first
          onClick={handleBack}
          data-for="tooltip"
          data-tip="Go back..."
          data-place="right"
        >
          <Back />
        </IconButton>
        <Title>Configure component</Title>
        <IconButton
          last
          onClick={handleClose}
          data-for="tooltip"
          data-tip="Close"
          data-place="left"
        >
          <Close />
        </IconButton>
      </Header>

      <Content>
        <Formik
          initialValues={getInitialValues(component)}
          onSubmit={values => {
            console.log('values:', values);
            handleComponentDrop(null, {
              type: component.type,
              configurations: values,
            });
            handleClose();
          }}
        >
          {({ values }) => (
            <Form>
              <DragArea>
                <DraggableComponent
                  component={component}
                  configurations={values}
                  handleClose={handleClose}
                />
              </DragArea>

              <FormScroll autoComplete="off">
                {component.configurations.map(configuration => (
                  <Field
                    key={configuration.name}
                    component={ComponentConfigurationInput}
                    {...configuration}
                    validate={
                      configuration.validate
                        ? value =>
                            configuration.validate(value, values)
                        : null
                    }
                  />
                ))}
              </FormScroll>

              <Footer>
                <Hint>(hint: you can also drag the component)</Hint>
                <SubmitButton>Add to circuit</SubmitButton>
              </Footer>
            </Form>
          )}
        </Formik>
      </Content>
    </>
  );
};

export default ComponentConfiguration;
