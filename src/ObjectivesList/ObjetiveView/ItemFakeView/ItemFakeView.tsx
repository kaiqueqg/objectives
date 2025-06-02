import { View, StyleSheet, Text } from "react-native";
import { ObjectivePallete } from "../../../Colors";
import { FontPalette } from "../../../../fonts/Font";
import { useUserContext } from "../../../Contexts/UserContext";

export const New = () => {
  return(
    {
    }
  )
}

export interface ItemFakeViewProps{
  objTheme: ObjectivePallete,
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
      borderColor: o.objtitle,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderRadius: 5,
    },
    titleText:{
      color: o.objtitle,
    },
  });

  return (
    <View style={s.itemFakeContainer}>
      <Text style={s.titleText}>click to be the first</Text>
    </View>
  );
};

export default ItemFakeView;