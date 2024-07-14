import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        int N = scanner.nextInt();
        
        
        boolean[] present = new boolean[N + 1];
        
       
        for (int i = 0; i < N; i++) {
            int number = scanner.nextInt();
            if (number <= N) {
                present[number] = true;
            }
        }
        
       
        for (int i = 1; i <= N; i++) {
            if (!present[i]) {
                System.out.println(i);
                return;
            }
        }
        
       
        System.out.println(N + 1);
    }
}
