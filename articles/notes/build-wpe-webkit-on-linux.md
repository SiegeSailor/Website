---
tags: [linux, webkit]
---

# Build WPE Webkit on Linux

Most guides focus on building WPE WebKit for embedded platforms. This guide is for non-embedded developers who want to set up WPE WebKit on their X11 machines for debugging. Inspired by [Hikiko's Post for WPE](https://eleni.mutantstargoat.com/hikiko/wpe/), it offers a simpler installation process.

> Follow [WPE Webkit Wiki](https://trac.webkit.org/wiki/WPE) when developing on an embedded platform with Yocto or OpenEmbedded.

The guide is conducted with [Darter Pro from System76](https://system76.com/laptops/darter):

- **Disk Capacity**: 1.0 TB
- **GNOME Version**: 4.2.9
- **Graphics**: Mesa Intel® Arc(tm) Graphics(MTL)
- **Hardware Model**: System76 Darter Pro
- **Memory** 32.0 GiB
- **OS Name**: Pop!\_OS 22.04 LTS
- **OS Type**: 64-bit
- **Processor**: Intel® Core™ Ultra 7 155H × 21
- **Windowing System**: X11

## Build Dependencies

These installation steps can be performed in any directory other than `~/Documents/`. They will build the dependencies in the default system locations.

### Prerequesites

These packages are required since most of the dependencies will be built from the source code:

```shell
sudo apt-get update
sudo apt-get install \
    cmake ninja-build
```

:::note
Before starting the installation, the following packages recommended from online documentation and blogs were installed. While there haven't been verified if all of them were necessary, having them available can help if the installation encounters issues:

```shell
sudo apt-get update
sudo apt-get install \
    gobject-introspection graphviz libwebkit2gtk-4.0-dev libwpebackend-fdo-1.0-1 \
    libwpewebkit-1.0-3 libwpewebkit-1.0-dev libwpewebkit-1.0-doc \
    python3 python-is-python3 python3-pip valac wpewebkit-driver
pip install \
    jinja2 markdown markupsafe packaging pygments typogrify
```

:::

### WPE General-Purpose Library

First of all, install libwpe, which is required to build for any WPE applications:

```shell
cd ~/Documents/
git clone \
    git@github.com:WebPlatformForEmbedded/libwpe.git
cd libwpe
mkdir build
cd build
cmake .. -DCMAKE_EXPORT_COMPILE_COMMANDS=Yes
```

### WPE Backend

An open source contribution for WPE by [Igalia](https://www.igalia.com/):

```shell
cd ~/Documents/
git clone \
    git@github.com:Igalia/WPEBackend-fdo.git
export PKG_CONFIG_PATH=$PKG_CONFIG_PATH:/usr/local/lib/pkgconfig
cd WPEBackend-fdo
meson build
meson configure --buildtype=debug --prefix=/usr/local build
ninja --directory=build --jobs=8 install
```

:::info
Set `PKG_CONFIG_PATH` to the location where **libwpe** has been installed in a different locations.
:::

### Webkit

The Webkit itself:

```shell
cd ~/Documents/
git clone \
    git://git.webkit.org/WebKit.git
cd WebKit
Tools/wpe/install-dependencies
Tools/Scripts/update-webkitwpe-libs
Tools/Scripts/build-webkit --release --wpe
```

## Nested Run

WebKit is now ready to use. However, in order to run WebKit under an X11 system, we need to run **Weston** nested:

```shell
cd ~/Documents/
sudo apt-get install \
    weston
echo "export XDG_RUNTIME_DIR=/tmp" >> /home/user/.bashrc
```

:::info
`XDG_RUNTIME_DIR` indicates where Weston stores its socket files.
:::

Everything is set up. Start the `cog` browser with the following commands to test:

```shell
cd ~/Documents/Webkit
weston
Tools/Scripts/run-minibrowser --wpe \
    https://www.google.com
```

![Weston Cog Google](/images/weston-cog-google.png)

> A photo for a running Webkit on a System76 Darter Pro. The left terminal runs `weston`, while the right terminal runs the `cog` browser displaying [https://www.google.com](https://www.google.com).
