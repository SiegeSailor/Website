---
technologies: [grpc]
---

# Protocol Buffers Document

This article aims to utilize [Protoc-Gen-Doc](https://github.com/pseudomuto/protoc-gen-doc) to generate the HTML file for protocol buffer schemas to avoid time spent on duplicating documents and customize the format.

## General Usage

Ideally, we will want to generate a single `index.html` file for multiple `*.proto` files. Let's assume we have the similar files structure as below:

```shell
└── 📁schemas
    └── 📁nested
        └── bar.proto
    └── foo.proto
```

## Customized Templates

### Environment Variables

## Integration
