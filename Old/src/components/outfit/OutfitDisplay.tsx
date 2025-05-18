import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Outfit } from '../../types/clothing';
import { typography } from '../../styles/typography';
import { Theme } from '../../styles/theme';
import { useTheme } from '../../utils/ThemeContext';

interface OutfitDisplayProps {
  outfit: Outfit;
  onEdit?: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

/**
 * A component for displaying clothing outfit recommendations
 */
const OutfitDisplay: React.FC<OutfitDisplayProps> = ({
  outfit,
  onEdit,
  onSave,
  onShare,
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      <View style={styles.outfitHeaderRow}>
        <Text style={StyleSheet.flatten([typography.subheading, styles.outfitHeader])}>
          TODAY'S <Text style={StyleSheet.flatten([typography.heading, styles.outfitHeaderItalic])}>Outfit</Text>
        </Text>
      </View>
      
      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onEdit}
        >
          <Text style={typography.button}>EDIT</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onSave}
        >
          <Text style={typography.button}>SAVE</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onShare}
        >
          <Text style={typography.button}>SHARE</Text>
        </TouchableOpacity>
      </View>
      
      {/* Outfit grid display */}
      <View style={styles.bentoBox}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1, gap: 10 }}>
            <View style={styles.bentoCellOuter}>
              <View style={styles.bentoCell}>
                <Image 
                  source={outfit.top || require('../../assets/mock/top.png')} 
                  style={styles.clothingImg} 
                  resizeMode="contain" 
                />
                <Text 
                  style={StyleSheet.flatten([typography.label, styles.bentoLabel])} 
                  ellipsizeMode="tail" 
                  numberOfLines={1}
                >
                  Top
                </Text>
              </View>
            </View>
            
            <View style={styles.bentoCellOuter}>
              <View style={styles.bentoCell}>
                <Image 
                  source={outfit.bottoms || require('../../assets/mock/bottoms.png')} 
                  style={styles.clothingImg} 
                  resizeMode="contain" 
                />
                <Text 
                  style={StyleSheet.flatten([typography.label, styles.bentoLabel])} 
                  ellipsizeMode="tail" 
                  numberOfLines={1}
                >
                  Bottoms
                </Text>
              </View>
            </View>
          </View>
          
          <View style={{ flex: 1, gap: 10 }}>
            <View style={styles.bentoCellOuter}>
              <View style={styles.bentoCell}>
                <Image 
                  source={outfit.outerwear || require('../../assets/mock/outerwear.png')} 
                  style={styles.clothingImg} 
                  resizeMode="contain" 
                />
                <Text 
                  style={StyleSheet.flatten([typography.label, styles.bentoLabel])} 
                  ellipsizeMode="tail" 
                  numberOfLines={1}
                >
                  Outerwear
                </Text>
                <Text style={StyleSheet.flatten([typography.caption, styles.sponsored])}>
                  sponsored
                </Text>
              </View>
            </View>
            
            <View style={styles.bentoCellOuter}>
              <View style={styles.bentoCell}>
                <Image 
                  source={outfit.accessory || require('../../assets/mock/accessory.png')} 
                  style={styles.clothingImg} 
                  resizeMode="contain" 
                />
                <Text 
                  style={StyleSheet.flatten([typography.label, styles.bentoLabel])} 
                  ellipsizeMode="tail" 
                  numberOfLines={1}
                >
                  Accessory
                </Text>
              </View>
            </View>
            
            <View style={styles.bentoCellOuter}>
              <View style={styles.bentoCell}>
                <Image 
                  source={outfit.shoes || require('../../assets/mock/shoes.png')} 
                  style={styles.clothingImg} 
                  resizeMode="contain" 
                />
                <Text 
                  style={StyleSheet.flatten([typography.label, styles.bentoLabel])} 
                  ellipsizeMode="tail" 
                  numberOfLines={1}
                >
                  Shoes
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    minHeight: 300,
  },
  outfitHeaderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginHorizontal: 20, 
    marginTop: 8 
  },
  outfitHeader: {},
  outfitHeaderItalic: {},
  actionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginHorizontal: 20, 
    marginTop: 12, 
    marginBottom: 8 
  },
  actionButton: { 
    flex: 1, 
    backgroundColor: '#000', 
    borderRadius: 12, 
    marginHorizontal: 4, 
    height: 32, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  bentoBox: { 
    marginHorizontal: 20, 
    marginTop: 8, 
    marginBottom: 8 
  },
  bentoCellOuter: { 
    flex: 1, 
    margin: 0, 
    padding: 0 
  },
  bentoCell: { 
    flex: 1, 
    backgroundColor: '#F5F5F5', 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: 120, 
    position: 'relative', 
    width: '100%' 
  },
  clothingImg: { 
    width: 60, 
    height: 60, 
    marginTop: 8 
  },
  bentoLabel: {
    position: 'absolute',
    left: -25,
    bottom: 40,
    transform: [
      { rotate: '-90deg' },
    ],
    textAlign: 'left',
    pointerEvents: 'none',
    width: 80,
  },
  sponsored: { 
    position: 'absolute', 
    right: 8, 
    bottom: 8 
  },
});

export default OutfitDisplay;
