# Matrix

[src/modules/matrix.js:9-94](https://github.com/Gmousse/dataframe-js/blob/a0683cbf6edf3fbb2b24c6140aba7b05fa0869e2/src/modules/matrix.js#L9-L94 "Source code on GitHub")

Matrix module for DataFrame, providing basic mathematical matrix computations.

## constructor

[src/modules/matrix.js:14-17](https://github.com/Gmousse/dataframe-js/blob/a0683cbf6edf3fbb2b24c6140aba7b05fa0869e2/src/modules/matrix.js#L14-L17 "Source code on GitHub")

Start the Matrix module.

**Parameters**

-   `df` **DataFrame** An instance of DataFrame.

## isCommutative

[src/modules/matrix.js:28-30](https://github.com/Gmousse/dataframe-js/blob/a0683cbf6edf3fbb2b24c6140aba7b05fa0869e2/src/modules/matrix.js#L28-L30 "Source code on GitHub")

Check if two DataFrames are commutative, if both have the same dimensions.

**Parameters**

-   `df` **DataFrame** The second DataFrame to check.
-   `reverse` **\[[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** Revert the second DataFrame before the comparison. (optional, default `false`)

**Examples**

```javascript
df.matrix.isCommutative(df2)
```

Returns **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** True if they are commutative, else false.

## add

[src/modules/matrix.js:40-53](https://github.com/Gmousse/dataframe-js/blob/a0683cbf6edf3fbb2b24c6140aba7b05fa0869e2/src/modules/matrix.js#L40-L53 "Source code on GitHub")

Provide an elements pairwise addition of two DataFrames having the same dimensions.

**Parameters**

-   `df` **DataFrame** The second DataFrame to add.

**Examples**

```javascript
df.matrix.add(df2)
```

Returns **DataFrame** A new DataFrame resulting to the addition two DataFrames.

## product

[src/modules/matrix.js:63-65](https://github.com/Gmousse/dataframe-js/blob/a0683cbf6edf3fbb2b24c6140aba7b05fa0869e2/src/modules/matrix.js#L63-L65 "Source code on GitHub")

Provide a scalar product between a number and a DataFrame.

**Parameters**

-   `number` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The number to multiply.

**Examples**

```javascript
df.matrix.product(6)
```

Returns **DataFrame** A new DataFrame resulting to the scalar product.

## dot

[src/modules/matrix.js:75-93](https://github.com/Gmousse/dataframe-js/blob/a0683cbf6edf3fbb2b24c6140aba7b05fa0869e2/src/modules/matrix.js#L75-L93 "Source code on GitHub")

Multiply one DataFrame n x p and a second p x n.

**Parameters**

-   `df` **DataFrame** The second DataFrame to multiply.

**Examples**

```javascript
df.matrix.dot(df)
```

Returns **DataFrame** A new n x n DataFrame resulting to the product of two DataFrame.
