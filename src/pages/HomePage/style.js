import styled from "styled-components";
import ButtonComponent from "../../components/ButttonComponent/ButttonComponent";

export const WrapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: flex-start;
  font-size: 12px;
  height: 44px;
`;

export const WrapperButtonMore = styled(ButtonComponent)`
  &:hover {
    color:'#fff';
    background-color: rgb(13,92,182);
    span{
      color: #fff;

    }
  }
  width:100%;
  align-items: center;

  `
 export const WrapperProducts = styled.div`
display: flex;
gap 14px;
margin-top: 20px;
flex-wrap: wrap;
   `