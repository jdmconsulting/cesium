/*global defineSuite*/
defineSuite([
         'Core/BoxGeometry',
         'Core/VertexFormat',
         'Core/Cartesian3'
     ], function(
         BoxGeometry,
         VertexFormat,
         Cartesian3) {
    "use strict";
    /*global jasmine,describe,xdescribe,it,xit,expect,beforeEach,afterEach,beforeAll,afterAll,spyOn,runs,waits,waitsFor*/

    it('constructor throws without minimum corner', function() {
        expect(function() {
            return new BoxGeometry({
                maximumCorner : new Cartesian3()
            });
        }).toThrow();
    });

    it('constructor throws without maximum corner', function() {
        expect(function() {
            return new BoxGeometry({
                minimumCorner : new Cartesian3()
            });
        }).toThrow();
    });

    it('constructor creates optimized number of positions for VertexFormat.POSITIONS_ONLY', function() {
        var m = new BoxGeometry({
            minimumCorner : new Cartesian3(-1, -2, -3),
            maximumCorner : new Cartesian3(1, 2, 3),
            vertexFormat : VertexFormat.POSITION_ONLY
        });

        expect(m.attributes.position.values.length).toEqual(8 * 3);
        expect(m.indices.length).toEqual(12 * 3);
    });

    it('constructor computes all vertex attributes', function() {
        var minimumCorner = new Cartesian3(0, 0, 0);
        var maximumCorner = new Cartesian3(1, 1, 1);
        var m = new BoxGeometry({
            minimumCorner : minimumCorner,
            maximumCorner : maximumCorner,
            vertexFormat : VertexFormat.ALL
        });

        expect(m.attributes.position.values.length).toEqual(6 * 4 * 3);
        expect(m.attributes.normal.values.length).toEqual(6 * 4 * 3);
        expect(m.attributes.tangent.values.length).toEqual(6 * 4 * 3);
        expect(m.attributes.binormal.values.length).toEqual(6 * 4 * 3);
        expect(m.attributes.st.values.length).toEqual(6 * 4 * 2);

        expect(m.indices.length).toEqual(12 * 3);

        expect(m.boundingSphere.center).toEqual(Cartesian3.ZERO);
        expect(m.boundingSphere.radius).toEqual(maximumCorner.magnitude() * 0.5);
    });

    it('fromDimensions throws without dimensions', function() {
        expect(function() {
            return BoxGeometry.fromDimensions();
        }).toThrow();
    });

    it('fromDimensions throws with negative dimensions', function() {
        expect(function() {
            return BoxGeometry.fromDimensions({
                dimensions : new Cartesian3(1, 2, -1)
            });
        }).toThrow();
    });

    it('fromDimensions', function() {
        var m = BoxGeometry.fromDimensions({
            dimensions : new Cartesian3(1, 2, 3),
            vertexFormat : VertexFormat.POSITION_ONLY
        });

        expect(m.attributes.position.values.length).toEqual(8 * 3);
        expect(m.indices.length).toEqual(12 * 3);
    });
});