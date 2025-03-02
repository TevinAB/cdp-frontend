const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    index: "./src/index.ts",
  },
  output: {
    publicPath: "",
    filename: "index.js",
    library: "CDPFrontend", // TODO CHANGEME
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(t|j)s(x?)$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader" }],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/img/[hash][ext]"
        },
        use: [
          {
            loader: "image-webpack-loader",
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[hash][ext]"
        },
      },
      {
        test: /\.css/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
          },
        ],
      },
      // this rule will handle any vanilla CSS imports out of node_modules; it does not apply PostCSS,
      // nor does it convert the imported css to CSS Modules
      {
        test: (filepath) => filepath.endsWith(".css"),
        include: /node_modules/,
        use: [{ loader: MiniCssExtractPlugin.loader }, { loader: "css-loader" }],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", "css"],
  },
  externals: {
    react: "react",
  },
  plugins: [new MiniCssExtractPlugin({ filename: "[name].css" })],
};
