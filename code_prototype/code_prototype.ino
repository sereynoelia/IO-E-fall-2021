#include "Arduino_SensorKit.h"
#include "LIS3DHTR.h"
#include <Wire.h>

const int lightPin1 = 8; 
int inputPin = 3;    
int pirState = LOW;
int val = 0;
 
void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  while(!Serial);
  
  Accelerometer.begin();

  pinMode(inputPin, INPUT);     // declare sensor as input
  pinMode(lightPin1, OUTPUT); 
}
 
void loop() {
  val = digitalRead(inputPin);  // read input value
  
  // 3 axis
  Serial.print("x:"); 
  Serial.print(Accelerometer.readX());  // Read the X Value 
  Serial.print("  ");
  Serial.print("y:"); 
  Serial.print(Accelerometer.readY());  // Read the Y Value       
  Serial.print("  ");
  Serial.print("z:"); 
  Serial.println(Accelerometer.readZ());// Read the Z Value

 // int y = Accelerometer.getAccelerationX();

//  Serial.print(y); 


  if (val == HIGH) {            // if motion detected
   digitalWrite(lightPin1, HIGH);  // turn LED ON
   Serial.println("Motion detected");
   delay(500);
   if(pirState == HIGH){
    pirState = LOW;
   }
 } 
 else {
   digitalWrite(lightPin1, LOW); // turn LED OFF if we have no motion
 }

  
 
}
