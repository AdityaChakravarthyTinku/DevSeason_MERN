my_str = input()
l = len(my_str)
a = [-1]*l
my_stack = []

for i in range(l):
   if my_str[i] == '(' :
     my_stack.append(i)
   if my_str[i] == ')' :
        if len(my_stack) == 0 :
           a[i] = -1
        else :
           temp = my_stack.pop()
           a[i] = temp
           a[temp] = i
print(*a, sep = ' ')