import {Icon, Input} from '@ui-kitten/components';
import React from 'react';

const FormInput = (props) => {
  return (
    <Input
      style={props.style}
      placeholder={props.name}
      onBlur={props.onBlur}
      accessoryLeft={props.iconName ? <Icon name={props.iconName}/> : null}
      onChangeText={props.onChange}
      value={props.value}
      autoCapitalize="none"
      secureTextEntry={props.textEntry}
      multiline={props.multiline}
      textStyle={props.textStyle}
      textAlignVertical="top"
    />
  );
};

export default FormInput;
