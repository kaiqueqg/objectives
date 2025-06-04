import { View, StyleSheet,Text, Image, Vibration, TextInput } from "react-native";
import { ItemViewProps, Question } from "../../../Types";
import { FontPalette, fontWhite } from "../../../../fonts/Font";
import { colorPalette, globalStyle as gs } from "../../../Colors";
import { useUserContext } from "../../../Contexts/UserContext";
import PressInput from "../../../PressInput/PressInput";
import PressImage from "../../../PressImage/PressImage";
import { useState } from "react";
import PressText from "../../../PressText/PressText";
import React from "react";

export const New = () => {
  return(
    {
      Statement: '',
      Answer: '',
    }
  )
}

export interface QuestionViewProps extends ItemViewProps{
  question: Question,
}

const QuestionView = (props: QuestionViewProps) => {
  const { userPrefs, theme: t, fontTheme: f, putItem } = useUserContext();
  const { objTheme: o, isEditingPos, onDeleteItem, loadMyItems, question } = props;

  const [isEditingQuestion, setIsEditingQuestion] = useState<boolean>(false);
  const [tempQuestion, setTempQuestion] = useState<Question>(props.question);

  const onDoneQuestion = async () => {
    let newQuestion = {...tempQuestion};
    newQuestion.Statement = newQuestion.Statement.trim();
    newQuestion.Answer = newQuestion.Answer.trim();
    await putItem(newQuestion);
    setIsEditingQuestion(false);
    loadMyItems();
  }

  const onCancelQuestion = async () => {
    setIsEditingQuestion(false);
  }

  const onDelete = async () => {
    await onDeleteItem(question);
  }

  const s = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: o.marginHorizontal,
      marginVertical: o.marginVertical,
    },
    questionContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: (question.Statement.trim() !== '' && question.Answer.trim() !== '')? o.objbk:o.itembk,
      
      borderColor: (question.Statement.trim() !== '' && question.Answer.trim() !== '')?colorPalette.transparent:o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: o.borderRadius,
    },
    questionContainerSelected:{
      borderStyle: 'dashed',
      borderColor: o.bordercolorselected,
    },
    questionContainerEnding:{
      borderStyle: 'solid',
      borderColor: o.bordercolorselected,
    },
    textContainer:{
      flex: 1,
      justifyContent: 'center',

      minHeight: 40,
      margin: 2,
      paddingLeft: 10,
      color: 'beige',
    },
    questionDisplayContainer:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
    answerContainer:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    text:{
      color: o.itemtext,
    },
    textFade:{
      color: o.itemtextfade,
    },
    image:{
      ...gs.baseImage,
      tintColor: o.icontintcolor,
    },
    imageSmall:{
      ...gs.baseImage,
      tintColor: o.icontintcolor,
    },
    imageAnswerNormal:{
      tintColor: o.itemtext,
    },
    imageAnswerFade:{
      tintColor: o.itemtext,
    },
    imageDone:{
      tintColor: o.doneicontint,
    },
    imageCancel:{
      tintColor: o.cancelicontint,
    },
    imageDelete:{
      tintColor: o.trashicontint,
    },
    questionDoneImage:{
      tintColor: o.doneicontint,
    },
    inputsContainer:{
      flex: 1,
      flexDirection: 'row',
    },
    inputsLeft:{
      width: '15%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputsCenter:{
      width: '70%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputsRight:{
      width: '15%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputStyle:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',

      width: '100%',
      minHeight: 40,
      margin: 2,
      paddingLeft: 10,
      color: o.itemtext,

      borderRadius: 5,
      borderColor: o.icontintcolor,
      borderBottomWidth: 1,
      borderStyle: 'solid',
    },
  });

  return (
    <View style={s.container}>
      <View style={[s.questionContainer, props.isSelected && s.questionContainerSelected, props.isSelected && props.isEndingPos && s.questionContainerEnding]}>
        {!isEditingPos && isEditingQuestion?
          <View style={s.inputsContainer}>
            <View style={s.inputsLeft}>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageDelete]} confirm={true} source={require('../../../../public/images/trash.png')} onPress={onDelete}></PressImage>
            </View>
            <View style={s.inputsCenter}>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Statement"
                defaultValue={question.Statement}
                onChangeText={(value: string)=>{setTempQuestion({...tempQuestion, Statement: value})}} autoFocus></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Answer"
                defaultValue={question.Answer}
                onChangeText={(value: string)=>{setTempQuestion({...tempQuestion, Answer: value})}}></TextInput>
            </View>
            <View style={s.inputsRight}>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageDone]} source={require('../../../../public/images/done.png')} onPress={onDoneQuestion}></PressImage>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageCancel]} source={require('../../../../public/images/cancel.png')} onPress={onCancelQuestion}></PressImage>
            </View>
          </View>
          :
          <View style={s.questionDisplayContainer}>
            <View style={s.answerContainer}>
              <PressText
                style={s.textContainer}
                textStyle={s.text}
                text={question.Statement}
                onPress={()=>{if(!isEditingPos)setIsEditingQuestion(!isEditingQuestion)}}
                ></PressText>
            </View>
            <View style={s.answerContainer}>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.imageSmall, question.Answer.trim() === ''? s.imageAnswerFade:s.imageAnswerNormal]} source={require('../../../../public/images/arow-down-right-thicker.png')} onPress={()=>{}}></PressImage>
              <PressText
                style={s.textContainer}
                textStyle={s.text}
                text={question.Answer}
                onPress={()=>{if(!isEditingPos)setIsEditingQuestion(!isEditingQuestion)}}
                ></PressText>
            </View>
          </View>
        }
      </View>
    </View>
  );
};

export default QuestionView;