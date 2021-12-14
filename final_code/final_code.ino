#include "Arduino_SensorKit.h"
#include "LIS3DHTR.h"
#include <Wire.h>
#define button 4
// code regarding the pir motion sensor was taken from
//https://learn.adafruit.com/pir-passive-infrared-proximity-motion-sensor/using-a-pir-w-arduino
// the code is used to detect motion and turn on a light

int button_state = 0;
int ledPin = 13;                // choose the pin for the LED
int inputPin = 2;               // choose the input pin (for PIR sensor)
int pirState = LOW;             // we start, assuming no motion detected
int val = 0;                    // variable for reading the pin status

int sensors[2];

void setup() {
   // start serial port at 9600 bps:
   Serial.begin(9600);
   pinMode(button, INPUT);
   pinMode(ledPin, OUTPUT);      // declare LED as output
   pinMode(inputPin, INPUT);     // declare sensor as input

   Accelerometer.begin();
}
 
void loop() {

  float y = (Accelerometer.readY());
  
  val = digitalRead(inputPin); 
  if (val == HIGH) {         
    //digitalWrite(ledPin, HIGH);  
    if (pirState == LOW) {
      Serial.println("Motion detected!");
      pirState = HIGH;
    }
  } else {
    //digitalWrite(ledPin, LOW); 
    if (pirState == HIGH){
      Serial.println("Motion ended!");
      pirState = LOW;
    }
  }

  if (y > 0.10) {         
    digitalWrite(ledPin, HIGH);  
  } else {
    digitalWrite(ledPin, LOW); 
  }

    //read the number from the button sensor and put the value 
    //into the first index of the Array, repeat for all indexes of the Array
    
    button_state = digitalRead(button);
    sensors[0] = button_state;
    
    sensors[1] = val;

    Serial.println(y); 
     
    for (int thisSensor = 0; thisSensor < 2; thisSensor++) {

      int sensorValue = sensors[thisSensor];
      
      Serial.print(sensorValue);
      if (thisSensor == 1) {
         Serial.println();
      } else {
         Serial.print(",");
      }
   }
    delay(3000);              
}
