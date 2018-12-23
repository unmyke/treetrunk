import styled from 'styled-components';
import { getThemeColor, getThemeRadius } from '../../../lib';

const radius = getThemeRadius('molecule');
const primaryColor = getThemeColor('primary');
const successColor = getThemeColor('success');
const whiteColor = getThemeColor('white');

export const FormWrapper = styled.form`
  display: ${({ hidden }) => (hidden ? 'none' : 'block')};
  background-color: ${whiteColor};
  width: ${({ width }) => width};
  padding: 4em;
  text-align: left;
  border: none;
  border-radius: ${radius};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

export const ControllsWrapper = styled.div`
  width: auto;
  margin-top: 5em;
  margin: 5em -15px 0;
  display: flex;
  justify-content: flex-end;
  & > button {
    margin: 0 15px;
  }
`;

export const ContentWrapper = styled.div`
  width: auto;
  margin: 2em auto;
`;

export const HeaderWrapper = styled.div`
  background: radial-gradient(
    circle at 95% -50%,
    ${successColor} 5%,
    ${primaryColor} 90%
  );
  margin: -4em -4em 0 -4em;
  color: ${whiteColor};
  text-align: center;
  padding: 0.5em 1em;
  border-top-left-radius: ${radius};
  border-top-right-radius: ${radius};
`;
