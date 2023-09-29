#!/bin/bash

# Building apk for android
# eas build -p android  --profile preview

# Submit to ios
# eas build -p ios 
# eas submit -p ios

# Submit to android
eas build -p android
eas submit -p android