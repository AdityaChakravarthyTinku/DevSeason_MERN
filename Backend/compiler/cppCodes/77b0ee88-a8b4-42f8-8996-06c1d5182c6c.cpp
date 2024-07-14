#include <bits/stdc++.h>
 using namespace std; 
int main() {
int n;
cin>>n;
set<long long> s;
long long t;
for(int i = 0;i<n;i++){
cin>>t;
s.insert(t);}
long long i = 1;
for(auto it:s){
if(it==i) i++;
else break;
}
cout<<i;
return 0;
}