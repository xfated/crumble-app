#!/bin/bash

# Building apk for android
eas build -p android  --profile preview
eas build -p ios 

# Build and submit to testflight
eas submit -p ios