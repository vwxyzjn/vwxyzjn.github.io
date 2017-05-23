<template>
  <div class="research-article">
    <div v-html="rawHtml">
    </div>
  </div>
</template>

<script>
import 'katex/dist/katex.css'
import renderMathInElement from 'katex/dist/contrib/auto-render.js'
import marked from 'marked'
import Prism from 'prismjs'
import 'prismjs/themes/prism-coy.css'
import 'prismjs/prism.js'
import 'prismjs/components/prism-python.js'

let article = `

# The Plane Shooting Problem (Dynamic Programming)
Author: Costa Huang

## Introduction

The nation is at war. The enemy send out a squadron of $n$ planes to attack our troops from various angles. You have a very precise anti-aircraft launcher that will be used to shoot enemy planes. If the launcher is aimed directly at an enemy plane, it's guaranteed to destroy the plane. Unfortunately, your launcher is ponderous to reposition. Namely, you can only move 1 degree per minute. Then 1 plane enter your shoot range per minute. Once they go passed your shoot range, they are gone and you can't shoot them again. You are tasked to destroy the first plane, and then destroy as many plane as possible. 

## Examples

The plane is coming at [50,49,60,48,54,55,56,57,58] angles for each minute. You shoot down the first plane at 50 degree and you can either statys at 50 degree, move to 51 degree, or move to 49 degree. The optimal solution would be shooting down 6 aircraft: [50,54,55,56,57,58].

## Analysis

Notice this problem can be solved by brute force method. For each position, we can either statys at $k$ degree, move to $k+1$ degree, or move to $k-1$ degree. So we can just try all possible possibilities and see which possibility shoot the most plane. We therefore demonstrate a brute force approach:



\`\`\`python
import pandas as pd
import numpy as np
    
# Some testing data
a_1 = [50,49,60,48,54,55,56,57,58]
a_2 = [50,49,60,48,54,55,56,47,46]
a_3 = [50,80,81,82,83]
a_4 = [50,51,49,48]
a_5= [50,51,50,51,50,55,56,57,58,59,60]
a_6 = [50,49,48,50,50,50]


def brute_force(angles, start_angle):
    
    if len(angles) == 0:
        return 0
    x = brute_force(angles[1:], start_angle+1)
    y = brute_force(angles[1:], start_angle-1)
    z = brute_force(angles[1:], start_angle)
    if angles[0] == start_angle:
        return max(x + 1, y + 1, z + 1)
    else:
        return max(x, y, z)
    
print(brute_force(a_1, a_1[0]))
print(brute_force(a_2, a_2[0]))
print(brute_force(a_5, a_5[0]))
\`\`\`

    6
    5
    8
    

Then we draw the brute force tree for analysis:


\`\`\`python
from IPython.display import Image
Image("pic.JPG", height = 600, width = 600)
\`\`\`




![Responsive image](${require('./output_3_0.jpeg')})



We somehow spotted this pattern: there are so many interconnected edges, which means we can maybe find a way to efficiently use the past information. For example, if we want to know what's the maximum number of planes we can shoot down if we end in 49, there are only two ways to 49: [50,49,49], [50,50,49], but in the process we would have already know which ways shoot down more planes, and we can just take the maximum of them. Therefore we demonstrate the dynamic programming approach:


\`\`\`python
angles = a_6
start_angle = angles[0]

df = pd.DataFrame(index = angles, columns = range(start_angle - len(angles),start_angle + len(angles)+1), data = 0)
def dynamic_programming(df, print_output = False):
    df.iloc[0][start_angle] = 1
    columns = list(df.columns)
    rows = list(df.index)
    
    for row in range(0, len(df)-1):
        # record the degree of the upcoming plane, which is in next row
        plane_degree = rows[row+1]
        
        for col in range(1, len(df.iloc[0])-1):
            # if the current column has data, the cannon can
            # go down left, go down, or go down right
            if df.iloc[row].iloc[col] != 0:
                data = df.iloc[row].iloc[col]
                
                # go down left
                left_column_degree = columns[col-1]
                # if our move results in a new destoryed plane: 
                if left_column_degree == plane_degree:
                    df.iloc[row+1].iloc[col-1] = max(df.iloc[row+1].iloc[col-1], data + 1)
                else:
                    df.iloc[row+1].iloc[col-1] = max(df.iloc[row+1].iloc[col-1], data)
                    
                # go down
                down_column_degree = columns[col]
                # if our move results in a new destoryed plane: 
                if down_column_degree == plane_degree:
                    df.iloc[row+1].iloc[col] = max(df.iloc[row+1].iloc[col], data + 1)
                else:
                    df.iloc[row+1].iloc[col] = max(df.iloc[row+1].iloc[col], data)
                    
                # go down right
                right_column_degree = columns[col+1]
                # if our move results in a new destoryed plane: 
                if right_column_degree == plane_degree:
                    df.iloc[row+1].iloc[col+1] = max(df.iloc[row+1].iloc[col+1], data + 1)
                else:
                    df.iloc[row+1].iloc[col+1] = max(df.iloc[row+1].iloc[col+1], data)
        
        if print_output == True:
            print(df)
            print("===============================================================")
            
    # now we are ready to trace the planes we shoot down
    # in the last row search the largest possible planes shoot down in the current row,
    # namely, max_planes = [planes shoot down, column number]
    row = len(df)-1 
    max_planes = [0,0]
    for col in range(0, len(df.iloc[row])):
        if df.iloc[row].iloc[col] > max_planes[0]:
            max_planes[0] = df.iloc[row].iloc[col]
            max_planes[1] = col
    
    
    # now find the order of planes to shoot down
    moving_record = [columns[max_planes[1]]]
    print("now we start to trace back our move")
    while (row > 0):
        # from the last row where we hit maximum number of plane, we can go up, go up left, go up right to trace
        # the record, but we need to go to the maximum of them
        left_col = max_planes[1]-1
        right_col = max_planes[1]+2
        # reset max_planes[planes shoot down] and go up one row
        max_planes[0] = 0  
        row -= 1
        for col in range(left_col, right_col):
            if df.iloc[row].iloc[col] > max_planes[0]:
                max_planes[0] = df.iloc[row].iloc[col]
                max_planes[1] = col
        
        moving_record += [columns[max_planes[1]]]
        
        print(moving_record)
    
    moving_record.reverse()
    print("after reversing, now the moving record is:")
    print(moving_record)
    
    
    # Lastly, we ouput the specific planes we choose to shoot
    planes_chosen = []
    for i in range(0, len(df.index)):
        if df.index[i] == moving_record[i]:
            planes_chosen += [df.index[i]]
    
    print("lastly, we print out planes chosen to shoot down")
    print(planes_chosen)
    
    return max(df.iloc[-1])
    


dp_output = dynamic_programming(df, print_output = True)
print("input data is ", angles)
print("dynamic programming can shoot down", dp_output, "planes")
print("brute force method can shoot down", brute_force(angles, start_angle), "planes")
\`\`\`

        44  45  46  47  48  49  50  51  52  53  54  55  56
    50   0   0   0   0   0   0   1   0   0   0   0   0   0
    49   0   0   0   0   0   2   1   1   0   0   0   0   0
    48   0   0   0   0   0   0   0   0   0   0   0   0   0
    50   0   0   0   0   0   0   0   0   0   0   0   0   0
    50   0   0   0   0   0   0   0   0   0   0   0   0   0
    50   0   0   0   0   0   0   0   0   0   0   0   0   0
    ===============================================================
        44  45  46  47  48  49  50  51  52  53  54  55  56
    50   0   0   0   0   0   0   1   0   0   0   0   0   0
    49   0   0   0   0   0   2   1   1   0   0   0   0   0
    48   0   0   0   0   3   2   2   1   1   0   0   0   0
    50   0   0   0   0   0   0   0   0   0   0   0   0   0
    50   0   0   0   0   0   0   0   0   0   0   0   0   0
    50   0   0   0   0   0   0   0   0   0   0   0   0   0
    ===============================================================
        44  45  46  47  48  49  50  51  52  53  54  55  56
    50   0   0   0   0   0   0   1   0   0   0   0   0   0
    49   0   0   0   0   0   2   1   1   0   0   0   0   0
    48   0   0   0   0   3   2   2   1   1   0   0   0   0
    50   0   0   0   3   3   3   3   2   1   1   0   0   0
    50   0   0   0   0   0   0   0   0   0   0   0   0   0
    50   0   0   0   0   0   0   0   0   0   0   0   0   0
    ===============================================================
        44  45  46  47  48  49  50  51  52  53  54  55  56
    50   0   0   0   0   0   0   1   0   0   0   0   0   0
    49   0   0   0   0   0   2   1   1   0   0   0   0   0
    48   0   0   0   0   3   2   2   1   1   0   0   0   0
    50   0   0   0   3   3   3   3   2   1   1   0   0   0
    50   0   0   3   3   3   3   4   3   2   1   1   0   0
    50   0   0   0   0   0   0   0   0   0   0   0   0   0
    ===============================================================
        44  45  46  47  48  49  50  51  52  53  54  55  56
    50   0   0   0   0   0   0   1   0   0   0   0   0   0
    49   0   0   0   0   0   2   1   1   0   0   0   0   0
    48   0   0   0   0   3   2   2   1   1   0   0   0   0
    50   0   0   0   3   3   3   3   2   1   1   0   0   0
    50   0   0   3   3   3   3   4   3   2   1   1   0   0
    50   0   3   3   3   3   4   5   4   3   2   1   1   0
    ===============================================================
    now we start to trace back our move
    [50, 50]
    [50, 50, 49]
    [50, 50, 49, 48]
    [50, 50, 49, 48, 49]
    [50, 50, 49, 48, 49, 50]
    
    after reversing, now the moving record is:
    [50, 49, 48, 49, 50, 50]
    
    lastly, we print out planes chosen to shoot down
    [50, 49, 48, 50, 50]
    
    input data is  [50, 49, 48, 50, 50, 50]
    dynamic programming can shoot down 5 planes
    brute force method can shoot down 5 planes
    

Now we can test different data by generating some random list and run the program to see when does brute force become really slow.


\`\`\`python
t = np.random.choice(10, 14) + 50
t
# (2, 5) + 10 would out put size 5, origin 10, random integer from (10-2, 10+2) 
# at size 14 is where you can see brute force takes more than an instant
# notice 3^14 = 4782969
\`\`\`




    array([59, 53, 50, 50, 54, 56, 50, 58, 53, 57, 54, 58, 52, 53])




\`\`\`python
angles = t
start_angle = angles[0]
df = pd.DataFrame(index = angles, columns = range(start_angle - len(angles),start_angle + len(angles)+1), data = 0)
dp_ouput = dynamic_programming(df)
print("\ninput data is ", angles)
print("dynamic programming can shoot down", dp_ouput, "planes")
print("brute force method can shoot down", brute_force(angles, start_angle), "planes")
\`\`\`

    now we start to trace back our move
    [53, 52]
    [53, 52, 53]
    [53, 52, 53, 54]
    [53, 52, 53, 54, 53]
    [53, 52, 53, 54, 53, 53]
    [53, 52, 53, 54, 53, 53, 54]
    [53, 52, 53, 54, 53, 53, 54, 55]
    [53, 52, 53, 54, 53, 53, 54, 55, 56]
    [53, 52, 53, 54, 53, 53, 54, 55, 56, 55]
    [53, 52, 53, 54, 53, 53, 54, 55, 56, 55, 56]
    [53, 52, 53, 54, 53, 53, 54, 55, 56, 55, 56, 57]
    [53, 52, 53, 54, 53, 53, 54, 55, 56, 55, 56, 57, 58]
    [53, 52, 53, 54, 53, 53, 54, 55, 56, 55, 56, 57, 58, 59]
    
    after reversing, now the moving record is:
    [59, 58, 57, 56, 55, 56, 55, 54, 53, 53, 54, 53, 52, 53]
    
    lastly, we print out planes chosen to shoot down
    [59, 56, 53, 54, 52, 53]
    
    input data is  [59 53 50 50 54 56 50 58 53 57 54 58 52 53]
    dynamic programming can shoot down 6 planes
    brute force method can shoot down 6 planes
`

// document.getElementById('results').innerHTML = (marked(article))
export default {
  name: 'article',
  data(){
    return {
      rawHtml: marked(article)
    }
  },
  mounted(){
    Prism.highlightAll()
    /*eslint-disable */
    renderMathInElement(document.body,{
        delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "\\[", right: "\\]", display: true},
            {left: "$", right: "$", display: false},
            {left: "\\(", right: "\\)", display: false}
            ]
        }
    )
    /*eslint-enable */
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '../article_font'
</style>
