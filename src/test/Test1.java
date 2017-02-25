package test;

public class Test1 {

	final static Test1 TEST = new Test1(2.8);
	
	static double initPrice = 20 ;
	double correntPrice;
	public Test1(double discount){
		correntPrice = initPrice-discount;
	}
	public static void main(String[] args) {

		System.out.println(Test1.TEST.correntPrice);
		Test1 test = new Test1(2.8);
		System.out.println(test.correntPrice);
	}

}

