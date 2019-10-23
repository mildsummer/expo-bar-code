import React from 'react';
import { Text, View, FlatList, SafeAreaView, Button } from 'react-native';
import { ListItem } from 'react-native-elements';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';

export default class App extends React.Component {

  state = {
    hasCameraPermission: null,
    data: []
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted'
    });
  }

  render() {

    const { hasCameraPermission, data, paused } = this.state;

    if(hasCameraPermission === null){
      return <Text>Requesting for camera permission</Text>
    }

    if(hasCameraPermission === false){
      return <Text>No access to camera</Text>
    }

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Camera
          ref={(ref) => {
            if (ref) {
              this.camera = ref;
            }
          }}
          onBarCodeScanned={this.handleBarCodeScanned}
          style={{height:300, width:300}}
          type={BarCodeScanner.Constants.Type.back}
        />
        {data.length ? (
          <SafeAreaView
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'red',
              opacity: 0.5
            }}
          >
            <FlatList
              style={{
                width: '100%',
                height: '100%'
              }}
              data={data}
              keyExtractor={(item, index) => (index.toString())}
              renderItem={({ item }) => (
                <ListItem
                  title={item}
                />
              )}
            />
          </SafeAreaView>
        ) : null}
        <Button
          title={paused ? 'start' : 'pause'}
          onPress={this.toggle}
        />
      </View>
    );
  }

  toggle = () => {
    const { paused } = this.state;
    if (paused) {
      this.camera.resumePreview();
    } else {
      this.camera.pausePreview();
    }
    this.setState({ paused: !paused });
  };

  handleBarCodeScanned = (result) => {
    const { data } = this.state;
    if (data.indexOf(result.data) === -1) {
      this.setState({
        data: (data || []).concat(result.data)
      });
    }
  }
}
