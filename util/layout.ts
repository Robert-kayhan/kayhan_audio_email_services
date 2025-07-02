// utils/layouts.ts

export const predefinedLayouts = [
  {
    name: "Hero Image Top",
    icon: "/layouts/hero-top.svg",
    design: {
      body: {
        rows: [
          {
            cells: [1],
            columns: [
              {
                contents: [
                  {
                    type: "image",
                    values: {
                      src: "https://via.placeholder.com/600x200",
                      alt: "Hero Image",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
  {
    name: "Hero Image Center",
    icon: "/layouts/hero-center.svg",
    design: {
      body: {
        rows: [
          {
            cells: [1],
            columns: [
              {
                contents: [
                  {
                    type: "image",
                    values: {
                      src: "https://via.placeholder.com/600x200",
                      alt: "Centered Image",
                    },
                  },
                  {
                    type: "text",
                    values: {
                      text: "<p style='text-align:center;'>Centered Headline</p>",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
  {
    name: "Image Left Text Right",
    icon: "/layouts/img-left-text-right.svg",
    design: {
      body: {
        rows: [
          {
            cells: [1, 1],
            columns: [
              {
                contents: [
                  {
                    type: "image",
                    values: {
                      src: "https://via.placeholder.com/150",
                      alt: "Left Image",
                    },
                  },
                ],
              },
              {
                contents: [
                  {
                    type: "text",
                    values: {
                      text: "<p>Right side text</p>",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
  {
    name: "Image Right Text Left",
    icon: "/layouts/img-right-text-left.svg",
    design: {
      body: {
        rows: [
          {
            cells: [1, 1],
            columns: [
              {
                contents: [
                  {
                    type: "text",
                    values: {
                      text: "<p>Left side text</p>",
                    },
                  },
                ],
              },
              {
                contents: [
                  {
                    type: "image",
                    values: {
                      src: "https://via.placeholder.com/150",
                      alt: "Right Image",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
  {
    name: "2 Images + Text Below",
    icon: "/layouts/2-img-text.svg",
    design: {
      body: {
        rows: [
          {
            cells: [1, 1],
            columns: [
              {
                contents: [
                  {
                    type: "image",
                    values: { src: "https://via.placeholder.com/150" },
                  },
                ],
              },
              {
                contents: [
                  {
                    type: "image",
                    values: { src: "https://via.placeholder.com/150" },
                  },
                ],
              },
            ],
          },
          {
            cells: [1],
            columns: [
              {
                contents: [
                  {
                    type: "text",
                    values: {
                      text: "<p>Description below</p>",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
  {
    name: "2 Columns Repeated",
    icon: "/layouts/2-col-repeat.svg",
    design: {
      body: {
        rows: Array(2).fill({
          cells: [1, 1],
          columns: [
            {
              contents: [
                {
                  type: "image",
                  values: { src: "https://via.placeholder.com/100" },
                },
                {
                  type: "text",
                  values: { text: "<p>Text under</p>" },
                },
              ],
            },
            {
              contents: [
                {
                  type: "image",
                  values: { src: "https://via.placeholder.com/100" },
                },
                {
                  type: "text",
                  values: { text: "<p>Text under</p>" },
                },
              ],
            },
          ],
        }),
      },
    },
  },
  {
    name: "3 Columns",
    icon: "/layouts/3-col.svg",
    design: {
      body: {
        rows: [
          {
            cells: [1, 1, 1],
            columns: Array(3).fill({
              contents: [
                {
                  type: "image",
                  values: {
                    src: "https://via.placeholder.com/100",
                    alt: "Image",
                  },
                },
                {
                  type: "text",
                  values: {
                    text: "<p>Column text</p>",
                  },
                },
              ],
            }),
          },
        ],
      },
    },
  },
  {
    name: "3 Columns with Description",
    icon: "/layouts/3-col-desc.svg",
    design: {
      body: {
        rows: [
          {
            cells: [1, 1, 1],
            columns: Array(3).fill({
              contents: [
                {
                  type: "image",
                  values: {
                    src: "https://via.placeholder.com/100",
                    alt: "Image",
                  },
                },
                {
                  type: "text",
                  values: {
                    text: "<p>Description</p>",
                  },
                },
                {
                  type: "button",
                  values: {
                    text: "Learn More",
                    href: "#",
                  },
                },
              ],
            }),
          },
        ],
      },
    },
  },
  {
    name: "Image with Border",
    icon: "/layouts/border-image.svg",
    design: {
      body: {
        rows: [
          {
            cells: [1],
            columns: [
              {
                contents: [
                  {
                    type: "image",
                    values: {
                      src: "https://via.placeholder.com/600x200",
                      alt: "Bordered Image",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
];
