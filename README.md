# dragonshark-ui
UI for Dragonshark

## Project installation and execution
Install the project by cloning it and, inside the project's directory, run:

```shell
npm install
```

This project makes use of [Electron](https://electronjs.org). Take a look there for any issues.

In particular, this project makes use of [electron-forge](https://www.electronforge.io/). Also
take a look there.

## Usage
For this project to be meaningful, you'll need:

1. A standard Linux. Ensure it has `nmcli` (NetworkManager) package installed.
2. A Gamepad. Either an actual one, or VirtualPad (check Hawa's VirtualPad client and server for
   more details, but let's keep it simple for now).
3. The games' launcher. Check it out [here](https://github.com/HawaTechnologies/launcher).
4. All the DragonShark Helpers, installed at `/usr/local/bin`.
   Check them out [here](https://github.com/HawaTechnologies/dragonshark-helpers).
5. Hopefully, a well configured ALSA mixer (`amixer`) for the sound to work, although that's not
   THAT mandatory (but the sound will not work otherwise).
6. Check the [Hawa Documentation](https://github.com/HawaTechnologies/dragonshark-helpers) on
   how to configure the OS structure and utilities (002-related files) so you find no quirks in
   the DragonShark UI experience, even in your desktop Linux OS.

Then you run:

```shell
npx run start
```

_Ensure your port 3000 is available, or the development app execution will crash._

## Build and Deploy
Run this command to build it:

```shell
npm run make -- --arch=arm64 --platform=linux
```

Then go into `out/make/deb/arm64` and copy the deb file to an external storage unit.

Then, plug that external storage unit into the intended video games' console and run the command:

```shell
# Assuming this one is the name of the .deb file:
sudo dpkg -i dragonshark-ui_1.0.0_amd64.deb
```

_If the whole process described in the Hawa Documentation, prior to the installation of DragonShark
UI, were executed properly, then this command will have no problems at all._

Finally, executing `dragonshark-ui` in the device (provided all the 1 to 6 dependencies are also
installed there and including, preferably, the VirtualPad server) will open the full-screen UI app.
Use a big screen or Smart TV for this app.