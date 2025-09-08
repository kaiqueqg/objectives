import { View, StyleSheet, Text } from "react-native";
import { ObjectivePallete } from "../../../Colors";
import { FontPalette } from "../../../../fonts/Font";
import { useUserContext } from "../../../Contexts/UserContext";
import { ItemFake } from "../../../Types";

export const New = () => {
  return(
    {
      Text: '',
      Fade: false,
    }
  )
}

export interface ItemFakeViewProps{
  objTheme: ObjectivePallete,
  itemFake: ItemFake,
}

const ItemFakeView = (props: ItemFakeViewProps) => {
  const { theme: t, fontTheme: f } = useUserContext();
  const { objTheme: o } = props;

  const s = StyleSheet.create({
    itemFakeContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      marginBottom: 4,
      marginHorizontal: 6,
      minHeight: 40,
      borderColor: props.itemFake.Fade? o.itemtextfade:o.objtitle,
      borderWidth: props.itemFake.Fade? 0:1,
      borderStyle: 'dashed',
      borderRadius: 5,
    },
    titleText:{
      color: props.itemFake.Fade? o.itemtextfade:o.objtitle,
    },
  });

  return (
    <View style={s.itemFakeContainer}>
      <Text style={s.titleText}>{props.itemFake.Title}</Text>
    </View>
  );
};

export default ItemFakeView;