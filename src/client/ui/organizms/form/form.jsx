import React, { Component } from 'react';
import {
  FormWrapper,
  ContentWrapper,
  ControllsWrapper,
  HeaderWrapper,
} from './styles';
import { Button, Header } from '../../atoms';
import { types } from 'src/constants/form';

export class Form extends Component {
  static defaultPprops = {
    hidden: true,
  };

  state = {
    hidden: this.props.hidden,
  };

  handleCloseButtonClick = (event) => {
    event.preventDefault();

    this.setState({
      hidden: true,
    });
  };

  handlePrimaryButtonClick = (event) => {
    event.preventDefault();
    const {
      onSubmit,
      entity: { id },
      type,
    } = this.props;
    const formData = this.getFormData(event.currentTarget);

    onSubmit({ ...formData, id }, type);

    this.setState({
      hidden: true,
    });
  };

  getFormData(form) {
    const formData = new FormData(form);
    if (formData.size === 0) {
      return;
    }

    return [...formData].reduce(
      (formData, [key, value]) => ({
        ...formData,
        [key]: value,
      }),
      {}
    );
  }

  render() {
    const { type, titlePrefix, Component, width } = this.props;
    const typeLabel = type === types.ADD ? 'Создать' : 'Обновить';

    return (
      <FormWrapper
        hidden={this.state.hidden}
        width={width}
        onSubmit={this.handlePrimaryButtonClick}>
        {titlePrefix ? (
          <HeaderWrapper>
            <Header>{` ${typeLabel} ${titlePrefix}`}</Header>
          </HeaderWrapper>
        ) : null}{' '}
        <ContentWrapper>{Component}</ContentWrapper>
        <ControllsWrapper>
          <Button
            color="secondary"
            onClick={this.handleCloseButtonClick}
            label="Отмена"
          />
          <Button color="primary" type="submit" label={typeLabel} />
        </ControllsWrapper>
      </FormWrapper>
    );
  }
}
