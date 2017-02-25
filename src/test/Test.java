package test;

public class Test {

	static {
	    x=5;
	}
	static int x = 0;
	public static void main(String[] args) {
		
		for(int i =0;i<2;i++){
			x = x++;
		}
		System.out.println(x);
	}
}
