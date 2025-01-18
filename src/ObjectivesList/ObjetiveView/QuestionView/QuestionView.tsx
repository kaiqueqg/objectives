import { View, StyleSheet,Text, Image, Vibration } from "react-native";
import { ItemViewProps, Question } from "../../../Types";
import { FontPalette, fontWhite } from "../../../../fonts/Font";
import { ObjectivePallete, ThemePalette } from "../../../Colors";
import { useUserContext } from "../../../Contexts/UserContext";
import PressInput from "../../../PressInput/PressInput";
import PressImage from "../../../PressImage/PressImage";
import { useState } from "react";

export interface QuestionViewProps extends ItemViewProps{
  question: Question,
}

const QuestionView = (props: QuestionViewProps) => {
  const { userPrefs, theme: t, fontTheme: f, putItem } = useUserContext();
  const { objTheme: o, isEditingPos, onDeleteItem, loadMyItems, question } = props;

  const onDoneStatement = async (newText: string) => {
    const newQuestion: Question = {...question, Statement: newText.trim() };
    await putItem(newQuestion);
    loadMyItems();
  }

  const onDeleteStatement = async () => {
    await onDeleteItem(question);
  }

  const onDoneAnswer = async (newText: string) => {
    const newQuestion: Question = {...question, Answer: newText };
    await putItem(newQuestion);
    loadMyItems();
  }

  const s = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      marginBottom: 4,
      marginHorizontal: 6,
    },
    statementAnswerColumn:{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: (question.Statement.trim() !== '' && question.Answer.trim() !== '')?o.objbk:o.itembk,
      
      borderRadius: 5,
      borderColor: (question.Statement.trim() !== '' && question.Answer.trim() !== '')?o.objbk:o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    statementAnswerColumnSelected:{
      borderStyle: 'dashed',
      borderColor: o.bordercolorselected,
    },
    statementAnswerColumnEnding:{
      borderStyle: 'solid',
      borderColor: o.bordercolorselected,
    },
    statementLine: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statement: {
      color: o.itemtext,
      fontWeight: 'bold',
    },
    statementDefaultText:{
      color: o.itemtextplaceholder,
    },
    answerLine: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 20,
      minHeight: 30,
    },
    answerStyle: {
      color: o.itemtext
    },
    answerDefaultText:{
      color: o.itemtextplaceholder,
    },
    inputStyle: {
      color: o.itemtext,
      borderColor: o.itemtext,
    },
    arrowImage: {
      height: 10,
      width: 10,
      margin: 5,
      tintColor: o.itemtextplaceholder,
    },
    questionDoneImage:{
      tintColor: o.doneicontint,
    },
    imageContainer: {
      height: 40,
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image:{
      height: 20,
      width: 20,
      tintColor: o.icontintcolor,
    },
    imageFade:{
      height: 20,
      width: 20,
      tintColor: o.icontintcolorfade,
    },
    imageMoveContainer:{
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 5,
      width: 40,
      height: 40,
    },
    imageMove:{
      height: 20,
      width: 20,
      tintColor: o.icontintcolor,
    },
  });

  return (
    <View style={s.container}>
    <View style={[s.statementAnswerColumn, props.isSelected && s.statementAnswerColumnSelected, props.isSelected && props.isEndingPos && s.statementAnswerColumnEnding]}>
        <View style={s.statementLine}>
          <PressInput 
            objTheme={o}
            text={question.Statement}
            onDone={onDoneStatement}
            onDelete={onDeleteStatement}
            defaultText={'Question'}
            uneditable={isEditingPos}

            textStyle={s.statement}
            inputStyle={s.inputStyle}
            defaultStyle={s.statementDefaultText}
            doneImageStyle={s.questionDoneImage}
            trashImageStyle={{tintColor: o.trashicontint}}
            >
          </PressInput>
        </View>
        <View style={s.answerLine}>
          <Image style={[s.arrowImage, question.Answer === ''? {tintColor: o.itemtextplaceholder}: {tintColor:o.itemtext}]} source={require('../../../../public/images/arow-down-right-thicker.png')}></Image>
          <PressInput 
            objTheme={o}
            text={question.Answer}
            defaultText={'Answer'}
            onDone={onDoneAnswer}
            uneditable={isEditingPos}

            textStyle={s.answerStyle}
            inputStyle={s.inputStyle}
            defaultStyle={s.answerDefaultText}
            doneImageStyle={s.questionDoneImage}>
          </PressInput>
        </View>
      </View>
    </View>
  );
};

export default QuestionView;